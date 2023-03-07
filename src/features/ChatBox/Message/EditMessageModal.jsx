import { useState, useContext } from "react";
import PropTypes from "prop-types";

import { TbEdit } from "react-icons/tb";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import useError from "hooks/useError";
import Modal from "components/Modal";
import StatusMessage from "components/StatusMessage";
import MessageBox from "components/MessageBox";
import { db } from "rosie-firebase";
import { UserContext } from "context/UserContext";

function EditMessageModal({
  setShowEditMessageModal,
  chatId,
  msgObj,
  isLastMsg,
}) {
  const { currentUser } = useContext(UserContext);
  const [editMessageLoading, setEditMessageLoading] = useState(false);
  const [editMessageError, setEditMessageError] = useError();
  const [message, setMessage] = useState({ text: msgObj.message.text });

  async function updateMessageText() {
    if (msgObj.type === "text" && message.text.trim() === "") {
      setEditMessageError("Messages of type text can't be empty");
      return;
    }

    if (
      msgObj.type === "file" &&
      message.text.trim() === "" &&
      msgObj.message.text === ""
    ) {
      setShowEditMessageModal(false);
      return;
    }

    setEditMessageError(undefined);
    setEditMessageLoading(true);

    try {
      const messageRef = doc(db, `chats/${chatId}/messages/${msgObj.id}`);
      const chatRef = doc(db, `chats/${chatId}`);

      if (isLastMsg) {
        const file = msgObj.message.file;
        const fileType = file?.type?.slice(0, file?.type?.indexOf("/"));

        const isGroupMsg = msgObj.isGroupMessage
          ? { "lastMsg.senderName": currentUser.displayName }
          : {};
        await Promise.all([
          updateDoc(messageRef, {
            "message.text": message.text.trim(),
          }),
          updateDoc(chatRef, {
            ...isGroupMsg,
            "lastMsg.senderId": currentUser.uid,
            "lastMsg.message": message.text.trim() || fileType,
            "lastMsg.createdAt": serverTimestamp(),
          }),
        ]);
      } else {
        await updateDoc(messageRef, {
          "message.text": message.text,
        });
      }
      setEditMessageLoading(false);
      setShowEditMessageModal(false);
    } catch (error) {
      console.log(error);
      setEditMessageError(typeof error === "object" ? error.message : error);
      setEditMessageLoading(false);
    }
  }

  return (
    <>
      {editMessageError && (
        <StatusMessage type="error" message={editMessageError} />
      )}
      <Modal
        closeModal={() => setShowEditMessageModal(false)}
        actionButtonName={editMessageLoading ? "Updating..." : "Update"}
        actionButtonHandler={updateMessageText}
        loading={editMessageLoading}
        modalTitle={{
          text: "Edit Message",
          icon: <TbEdit className="text-[1.2em]" />,
        }}
      >
        <MessageBox
          message={message}
          setMessage={(e) => setMessage({ text: e.target.innerText })}
          loading={editMessageLoading}
          className="rounded-xl border-2 border-primary-700 border-primary-400/50 p-3"
          placeholder="Type a message"
          hasInitialValue={true}
        />
      </Modal>
    </>
  );
}

EditMessageModal.propTypes = {
  setShowEditMessageModal: PropTypes.func.isRequired,
  chatId: PropTypes.string,
  msgObj: PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
  }),
  isLastMsg: PropTypes.bool,
};

export default EditMessageModal;
