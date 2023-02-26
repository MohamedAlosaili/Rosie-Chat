import { useState, useContext } from "react";
import { nanoid } from "nanoid";

import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import useError from "hooks/useError";
import useUploadFile from "hooks/useUploadFile";
import { db } from "rosie-firebase";
import { UserContext } from "context/UserContext";
import { ChatContext } from "context/ChatContext";
import { messageDocTemplate } from "util/objectsTemplate";

/**
 * @description - Handles sending messages (text or files)
 * @param {function} scrollToBottom - Function to scroll when a new document has been added
 * @returns {Array}
 */
function useSendMessage(scrollToBottom) {
  const { currentUser } = useContext(UserContext);
  const { selectedChat } = useContext(ChatContext);
  const [fileUploader] = useUploadFile();

  const [message, setMessage] = useState({ text: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useError();

  const chatPath = `chats/${selectedChat.id}`;
  const chatRef = doc(db, chatPath);
  const messagesRef = collection(db, `${chatPath}/messages`);

  /**
   * @description Sending message handler
   * @param {object} event - An object that contains event properties and functions
   * @param {object} validFile - An object that contains all file data that comes from file input (name, type, etc).
   */
  function sendMessage(event, validFile, closePreview) {
    event.preventDefault();

    const msgHasFile = validFile !== undefined;
    const msgHasText = message.text !== "";
    // Messages of type file shouldn't have text but they should have a file
    if (msgHasText || msgHasFile) {
      setLoading(true);

      const msgId = nanoid();

      (async function () {
        try {
          let file;
          if (msgHasFile) {
            const type = validFile.type;
            const { name, url } = await fileUploader(validFile, msgId);
            file = { type, name, url };
          }

          await addMessageDocument(msgId, file);

          resetValues(closePreview);
        } catch (error) {
          console.log(error);
          setError(error);
          setLoading(false);
        }
      })();
    }
  }

  /**
   * @description Add new message document to the messages collection of the chat
   * @param {string} id - Message document id
   * @param {object} [file = null] - An object that contains file info to be added to the message document (name, type, url).
   */
  async function addMessageDocument(id, file = null) {
    const { uid, photoURL, displayName } = currentUser;

    const type = file?.type ? "file" : "text";
    const createdAt = serverTimestamp();

    const additionGroupInfo = selectedChat?.isGroup
      ? {
          senderName: displayName,
          senderPhotoURL: photoURL,
        }
      : {};

    const lastMsgText =
      message.text || file?.type?.slice(0, file?.type?.indexOf("/"));
    const groupInfo = selectedChat?.isGroup ? { senderName: displayName } : {};

    await Promise.all([
      setDoc(
        doc(messagesRef, id),
        messageDocTemplate({
          type,
          id,
          isGroupMessage: selectedChat.isGroup,
          senderId: uid,
          ...additionGroupInfo,
          message: {
            text: message.text.trim(),
            file,
          },
          createdAt,
        })
      ),
      updateDoc(chatRef, {
        lastMsg: {
          ...groupInfo,
          senderId: uid,
          message: lastMsgText,
          createdAt,
        },
      }),
    ]);
  }

  /**
   * - Set states to the default value
   * - Scroll to the bottom of the chat
   * - Remove the preview url of files if it exists
   */
  function resetValues(closePreview) {
    setMessage({ text: "" });
    setLoading(false);
    closePreview && closePreview();
    scrollToBottom();
  }

  return [message, setMessage, sendMessage, loading, error];
}

export default useSendMessage;
