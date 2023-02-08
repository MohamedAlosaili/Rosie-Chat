import { useState, useContext } from "react";
import { nanoid } from "nanoid";

import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { useError } from "hooks";
import { db } from "rosie-firebase";
import { UserContext, ChatContext } from "hooks/context";
import { messageDocTemplate } from "util";
import { useUploadFile } from "hooks";

/**
 * @description - Handles sending messages (text or files)
 * @param {string} [inputName = "text"] - Text input name
 * @param {function} scrollToBottom - Function to scroll when a new document has been added
 * @param {function} [closePreview=() => null] - Function to set file object to default values
 * @returns {Array}
 */
function useSendMessage(
  inputName = "text",
  scrollToBottom,
  closePreview = () => null
) {
  const { currentUser } = useContext(UserContext);
  const { selectedChat } = useContext(ChatContext);
  const [fileUploader] = useUploadFile();

  const [text, setText] = useState({ [inputName]: "" });
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
  function sendMessage(event, validFile) {
    event.preventDefault();

    const msgHasFile = validFile !== undefined;
    const msgHasText = text[inputName] !== "";
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

          resetValues();
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
    // TODO: Add message doc and update chat doc are used in two places (useSendMessage & UserContext) try to combined them
    const additionGroupInfo = selectedChat?.isGroup
      ? {
          senderName: displayName,
          senderPhotoURL: photoURL,
        }
      : {};
    await addDoc(
      messagesRef,
      messageDocTemplate({
        type,
        id,
        isGroupMessage: selectedChat.isGroup,
        senderId: uid,
        ...additionGroupInfo,
        message: {
          text: text[inputName].trim(),
          file,
        },
        createdAt,
      })
    );

    const message =
      text[inputName] || file?.type?.slice(0, file?.type?.indexOf("/"));
    await updateDoc(chatRef, {
      lastMsg: {
        uid,
        message,
        createdAt,
      },
    });
  }

  /**
   * - Set states to the default value
   * - Scroll to the bottom of the chat
   * - Remove the preview url of files if it exists
   */
  function resetValues() {
    setText({ [inputName]: "" });
    setLoading(false);
    closePreview();
    scrollToBottom();
  }

  return [text, setText, sendMessage, loading, error];
}

export default useSendMessage;
