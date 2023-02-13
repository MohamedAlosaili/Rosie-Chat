import { useState } from "react";
import PropTypes from "prop-types";

import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { BsFillExclamationCircleFill } from "react-icons/bs";

import useError from "hooks/useError";
import Modal from "components/Modal";
import StatusMessage from "components/StatusMessage";
import { db } from "rosie-firebase";

const DeleteMessagePrompt = ({
  setShowDeletePrompt,
  chatId,
  messageId,
  isLastMsg,
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useError();

  async function deleteMessage() {
    setDeleteError(undefined);
    setDeleteLoading(true);
    try {
      const messageRef = doc(db, `chats/${chatId}/messages/${messageId}`);
      const chatRef = doc(db, `chats/${chatId}`);
      await deleteDoc(messageRef);

      if (isLastMsg) {
        await updateDoc(chatRef, {
          lastMsg: {
            uid: null,
            message: "Last message was deleted.",
            createdAt: serverTimestamp(),
          },
        });
      }

      setDeleteLoading(false);
    } catch (error) {
      console.log(error);
      setDeleteError(typeof error === "object" ? error.message : error);
      setDeleteLoading(false);
    }
  }

  return (
    <>
      {deleteError && <StatusMessage type="error" message={deleteError} />}
      <Modal
        closeModal={() => (deleteLoading ? null : setShowDeletePrompt(false))}
        className="flex flex-col gap-4"
        actionButtonName={deleteLoading ? "Deleting..." : "Delete"}
        actionButtonHandler={() => (deleteLoading ? null : deleteMessage())}
      >
        <BsFillExclamationCircleFill size={45} className="mx-auto text-error" />
        <p className="text-center dark:text-primary-200">
          Are you sure you want to delete this message
        </p>
      </Modal>
    </>
  );
};

DeleteMessagePrompt.propTypes = {
  setShowDeletePrompt: PropTypes.func.isRequired,
  chatId: PropTypes.string,
  messageId: PropTypes.string.isRequired,
  isLastMsg: PropTypes.bool,
};

export default DeleteMessagePrompt;