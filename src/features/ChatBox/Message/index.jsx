import { memo } from "react";
import PropTypes from "prop-types";

import uniqolor from "uniqolor";

import MediaModal from "components/MediaModal";
import Image from "components/Image";
import Video from "components/Video";
import { auth } from "rosie-firebase";

const Message = ({ msgObj, prevMsgSender, selectedChat }) => {
  // Announces are messages like create a group and members joined
  if (msgObj.type === "announce") {
    return (
      <div className="mx-auto my-2 w-fit rounded-lg bg-primary-700 p-2 text-xs leading-none">
        {msgObj.message.text}
      </div>
    );
  }

  const userColor = {
    "--color": uniqolor(msgObj.senderId + selectedChat.id, { lightness: 50 })
      .color,
  };
  // "uniqolor" generates the same color for the same value.
  // I choose to set the value as a combination of userId & chatId
  // With that I can generate different colors for the same user + I don't have to save it in the database

  const currentUserMsg = auth.currentUser.uid === msgObj.senderId;
  const isTheSameSender = prevMsgSender?.senderId === msgObj.senderId;
  const otherGroupMebmersMsgs = selectedChat.isGroup && !currentUserMsg;

  const dateFormater = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div
      className={`flex gap-2 ${currentUserMsg ? "flex-row-reverse" : ""} my-2`}
    >
      {otherGroupMebmersMsgs && (
        <div className="h-8 w-8">
          {!isTheSameSender && (
            <img
              src={msgObj.senderPhotoURL}
              alt={`${msgObj.senderName} avatar`}
              className={`object-cover ${
                msgObj.senderPhotoURL?.includes("default-avatar")
                  ? "bg-[var(--color)]"
                  : ""
              } rounded-50 p-px`}
              style={userColor}
            />
          )}
        </div>
      )}
      <div
        className={`max-w-[75%] lg:max-w-[65%] ${
          msgObj.type === "file" ? "w-[75%] p-1 lg:w-[65%]" : "p-2"
        } rounded-xl 
                  ${currentUserMsg ? "bg-accent" : "dark:bg-primary-800"} 
                  dark:text-primary-200
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
      </div>
    </div>
  );
};

Message.propTypes = {
  messageObject: PropTypes.shape({
    type: PropTypes.string,
    uid: PropTypes.string,
    message: PropTypes.shape({
      text: PropTypes.string,
      file: PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
      }),
    }).isRequired,
    createdAt: PropTypes.object,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  selectedChat: PropTypes.shape({
    id: PropTypes.string,
    isGroup: PropTypes.bool,
  }),
};

// memo() Prevents unnecessary re-render
export default memo(Message);
