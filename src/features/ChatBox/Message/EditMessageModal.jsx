import { useState, useContext } from "react";
import PropTypes from "prop-types";

import { TbEdit } from "react-icons/tb";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import useError from "hooks/useError";
import Modal from "components/Modal";
import Input from "components/Input";
import StatusMessage from "components/StatusMessage";
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
  const [message, setMessage] = useState({ editMessage: msgObj.message.text });

  async function updateMessageText() {
    if (msgObj.type === "text" && message.editMessage.trim() === "") {
      setEditMessageError("Messages of type text can't be empty");
      return;
    }

    if (
      msgObj.type === "file" &&
      message.editMessage.trim() === "" &&
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
      await updateDoc(messageRef, {
        "message.text": message.editMessage,
      });
      if (isLastMsg) {
        const file = msgObj.message.file;
        const fileType = file?.type?.slice(0, file?.type?.indexOf("/"));

        const isGroupMsg = msgObj.isGroupMessage
          ? { "lastMsg.senderName": currentUser.displayName }
          : {};
        await updateDoc(chatRef, {
          ...isGroupMsg,
          "lastMsg.senderId": currentUser.uid,
          "lastMsg.message": message.editMessage.trim() || fileType,
          "lastMsg.createdAt": serverTimestamp(),
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
        closeModal={() =>
          editMessageLoading ? null : setShowEditMessageModal(false)
        }
        actionButtonName={editMessageLoading ? "Updating..." : "Update"}
        actionButtonHandler={() =>
          editMessageLoading ? null : updateMessageText()
        }
        className="w-96"
      >
        <h1 className="flex items-center justify-center gap-2 text-2xl text-primary-200 ">
          Edit Message
          <TbEdit />
        </h1>
        <Input
          disabled={editMessageLoading}
          name="editMessage"
          placeholder="Edit message text"
          type="text"
          value={message.editMessage}
          setValue={setMessage}
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
