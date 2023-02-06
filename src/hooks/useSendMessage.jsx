import { useState, useContext, useRef } from "react";
import { nanoid } from "nanoid";

import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, uploadBytes } from "firebase/storage";

import { useError } from "hooks";
import { db, storage, ref } from "rosie-firebase";
import { UserContext } from "hooks/context";
import { messageDocTemplate } from "util";

/**
 * @description - Handles sending messages (text or files)
 * @param {string} [inputName = "text"] - Text input name
 * @param {object} props.selectedChat - Current chat info
 * @param {function} props.scrollToBottom - Function to scroll when a new document has been added
 * @param {function} [closePreview=() => null] - Function to set file object to default values
 * @returns {Array} [text, setText, sendMessage, loading, error]
 */
function useSendMessage(
  inputName = "text",
  { selectedChat, scrollToBottom },
  closePreview = () => null
) {
  const { currentUser } = useContext(UserContext);

  const [text, setText] = useState({ [inputName]: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useError();

  const chatPath = `chats/${selectedChat.id}`;
  const chatRef = doc(db, chatPath);
  const messagesRef = collection(db, `${chatPath}/messages`);

  /**
   * @description Sending handler
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
            const { name, url } = await fileData(validFile, msgId);
            file = { type, name, url };
          }

          await addMessageDocument(msgId, file);

          resetValues();
        } catch (error) {
          console.log(error);
          setError(error.message);
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
    await addDoc(
      messagesRef,
      messageDocTemplate({
        type,
        id,
        senderId: uid,
        senderName: displayName,
        senderPhotoURL: photoURL,
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
   * @description - Extract file name & file url
   * @param {object} file - An object that contains all file data that comes from file input (name, type, etc).
   * @param {string} id - Message document id
   * @returns {object} fileObject that contains the name and url
   */
  async function fileData(file, id) {
    const name = file.name + id;
    const url = await uploadFileToStorage(file, name);

    return { name, url };
  }

  /**
   * @description - Uploding file to the firebase storage
   * @param {object} file - An object that contains all file data that comes from file input (name, type, etc).
   * @param {string} fileName - File name to set a file reference path in firebase storage
   * @returns {string} file url
   */
  async function uploadFileToStorage(file, fileName) {
    const storageRef = ref(storage, `images/${fileName}`);

    await uploadBytes(storageRef, file);
    // Instead of retrieving the URL each time.
    // I choose to retrieve it once when it uploaded
    return await getDownloadURL(storageRef);
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
