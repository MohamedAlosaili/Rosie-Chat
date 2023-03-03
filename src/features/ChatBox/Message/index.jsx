import { memo, lazy, Suspense, useState, useContext } from "react";
import PropTypes from "prop-types";

import uniqolor from "uniqolor";
import { TbEdit } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";
import { AnimatePresence } from "framer-motion";
import { updateDoc, doc } from "firebase/firestore";

import MediaModal from "components/MediaModal";
import Image from "components/Image";
import Video from "components/Video";
import StatusMessage from "components/StatusMessage";
import { UserContext } from "context/UserContext";
import { db } from "rosie-firebase";

const EditMessageModal = lazy(() => import("./EditMessageModal"));
const DeleteMessagePrompt = lazy(() => import("./DeleteMessagePrompt"));

const Message = ({ msgObj, prevMsgSenderId, selectedChat, isLastMsg }) => {
  const { currentUser } = useContext(UserContext);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [showEditMessageModal, setShowEditMessageModal] = useState(false);

  // Announces are messages like create a group and members joined
  if (msgObj.type === "announce") {
    return (
      <div className="mx-auto my-2 w-fit rounded-lg bg-primary-300 p-2 text-xs font-medium leading-none dark:bg-primary-700">
        {msgObj.message.text}
      </div>
    );
  }

  const currentUserMsg = currentUser.uid === msgObj.senderId;
  const isTheSameSender = prevMsgSenderId === msgObj.senderId;
  const otherGroupMebmersMsgs = selectedChat.isGroup && !currentUserMsg;

  const userColor = {
    "--color": uniqolor(msgObj.senderId + selectedChat.id, { lightness: 50 })
      .color,
  };
  // "uniqolor" generates the same color for the same value.
  // I choose to set the value as a combination of userId & chatId
  // With that I can generate different colors for the same user + I don't have to save it in the database

  if (!currentUserMsg && msgObj?.readBy?.[currentUser.uid] === false) {
    updateDoc(doc(db, `chats/${selectedChat.id}/messages/${msgObj.id}`), {
      [`readBy.${currentUser.uid}`]: true,
    });
  }

  const dateFormater = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div
      className={`flex gap-2 ${
        currentUserMsg ? "flex-row-reverse" : ""
      } group my-2`}
    >
      {otherGroupMebmersMsgs && (
        <div className="h-8 w-8">
          {!isTheSameSender && (
            <Image
              img={{ url: msgObj.senderPhotoURL, name: msgObj.senderName }}
              className={`aspect-square rounded-full`}
              style={userColor}
            />
          )}
        </div>
      )}
      <div
        className={`max-w-[75%] lg:max-w-[65%] ${
          msgObj.type === "file" ? "w-[75%] p-1 lg:w-[65%]" : "p-2"
        } relative rounded-xl 
                  ${
                    currentUserMsg
                      ? "bg-accent"
                      : "bg-primary-700 dark:bg-primary-800"
                  } 
                  text-primary-200
        `}
      >
        {otherGroupMebmersMsgs && !isTheSameSender && (
          <h3
            className={`mb-1 truncate font-medium text-[var(--color)]`}
            style={userColor}
          >
            {msgObj.senderName}
          </h3>
        )}
        <div className="flex flex-col gap-2">
          {msgObj.type === "file" && (
            <>
              {msgObj.message.file?.type?.startsWith("image") ? (
                <div className="aspect-square">
                  <MediaModal mediaType="image">
                    <Image img={msgObj.message.file} />
                  </MediaModal>
                </div>
              ) : (
                <div className="aspect-video">
                  <MediaModal mediaType="video">
                    {(videoRef) => (
                      <Video video={msgObj.message.file} videoRef={videoRef} />
                    )}
                  </MediaModal>
                </div>
              )}
            </>
          )}
          {msgObj.message.text && (
            <p className={`${msgObj.type === "file" ? "px-1" : ""}`}>
              {msgObj.message.text}
            </p>
          )}
        </div>
        <time
          className={`mt-1 block leading-none ${
            !currentUserMsg ? "text-right" : ""
          } text-[0.65rem] opacity-60 
                      ${msgObj.type === "file" ? "mx-2" : ""}
          `}
        >
          {dateFormater.format(msgObj.createdAt?.toDate()) ?? "--:--"}
        </time>
        {currentUserMsg && (
          <div className="absolute top-1/2 right-full -translate-y-1/2 -translate-x-2">
            <TbEdit
              onClick={() => setShowEditMessageModal(true)}
              className="mb-2 cursor-pointer text-primary-900 transition-all group-hover:opacity-100 dark:text-primary-400 dark:hover:text-primary-200 md:text-lg md:opacity-0"
            />
            <BsFillTrashFill
              onClick={() => setShowDeletePrompt(true)}
              className="cursor-pointer text-red-700 transition-all hover:text-red-600 group-hover:opacity-100 md:text-lg md:opacity-0"
            />
          </div>
        )}
        <Suspense
          fallback={<StatusMessage message="Loading..." type="loading" />}
        >
          <AnimatePresence>
            {showEditMessageModal && (
              <EditMessageModal
                setShowEditMessageModal={setShowEditMessageModal}
                chatId={selectedChat.id}
                msgObj={msgObj}
                isLastMsg={isLastMsg}
              />
            )}
            {showDeletePrompt && (
              <DeleteMessagePrompt
                setShowDeletePrompt={setShowDeletePrompt}
                chatId={selectedChat.id}
                messageId={msgObj.id}
                isLastMsg={isLastMsg}
              />
            )}
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  );
};

Message.propTypes = {
  msgObj: PropTypes.shape({
    type: PropTypes.string,
    senderId: PropTypes.string,
    message: PropTypes.shape({
      text: PropTypes.string,
      file: PropTypes.shape({
        type: PropTypes.string,
        name: PropTypes.string,
        url: PropTypes.string,
      }),
    }).isRequired,
    createdAt: PropTypes.object,
    senderName: PropTypes.string,
    senderPhotoURL: PropTypes.string,
  }),
  selectedChat: PropTypes.shape({
    id: PropTypes.string,
    isGroup: PropTypes.bool,
  }),
  prevMsgSenderId: PropTypes.oneOfType([PropTypes.string, PropTypes.symbol]),
  isLastMsg: PropTypes.bool,
};

// memo() Prevents unnecessary re-render
export default memo(Message);
