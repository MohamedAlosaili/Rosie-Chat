import { useState, useContext, useRef } from "react";
import { nanoid } from "nanoid";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, uploadBytes } from "firebase/storage";

import { db, storage, ref } from "rosie-firebase";
import { UserContext } from "hooks/context";
import { messageDocTemplate } from "util";

/**
 * @description - Handles sending messages (text or files)
 * @param {string} [inputName = "text"] - Text input name
 * @param {object} selectedChat - Current chat info
 * @param {function} scrollToBottom - Function to scroll when new document has been added
 * @param {function} setPreview - Function to set new preview value
 * @returns {Array} [text, setText, sendMessage, loading, error, fileRef]
 */
function useSendMessage(
  inputName = "text",
  { selectedChat, scrollToBottom },
  setPreview
) {
  const userDoc = useContext(UserContext);

  const [text, setText] = useState({ [inputName]: "" });
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const [error, setError] = useState(undefined);

  function sendMessage(e) {
    e.preventDefault();

    const msgHasFile = fileRef.current;
    const msgHasText = text[inputName] !== "";
    // Messages of type file shouldn't have text but they should have a file
    if (msgHasText || msgHasFile) {
      setLoading(true);

      const chatType = selectedChat.isGroup ? "groups" : "direct";
      const messagesRef = collection(
        db,
        `${chatType}/${selectedChat.id}/messages`
      );
      const msgId = nanoid();

      (async function () {
        try {
          let file;
          if (msgHasFile) {
            const fileInfo = msgHasFile;

            const fileType = fileInfo.type.match(/(image|video)/)?.[0];

            if (fileType) {
              // Files more than 15 MB are not allowed
              if (fileInfo.size > 15_728_640)
                throw Error("File size must be under 15MB");

              const { name, url } = await fileData(fileInfo, msgId);
              file = { type: fileType, name, url };
            } else throw Error("File type not valid only Image/Video");
          }

          await addMessageDocument(msgId, messagesRef, file);

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
   * @param {string} id - A unique id for each message
   * @param {object} messagesRef - Reference to the messages collection
   * @param {symbol | object} file - If the message is not a file. the file will be undefined otherwise
   * it object contains file info to be added to the message document (name, type, url)
   */
  async function addMessageDocument(id, messagesRef, file) {
    const { uid, photoURL, displayName } = userDoc;

    const type = file ? "file" : "text";

    await addDoc(
      messagesRef,
      messageDocTemplate({
        id,
        uid,
        type,
        displayName,
        photoURL,
        message: {
          text: text[inputName].trim(),
          file,
        },
        createdAt: serverTimestamp(),
      })
    );
  }

  /**
   * @description - Extract file name & file url
   * @param {object} file - Object contains all file data that comes from file input
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
   * @param {object} file - Object contains all file data that comes from file input
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
    scrollToBottom();
    setPreview && setPreview(null);
  }

  return [text, setText, sendMessage, loading, error, fileRef];
}

export default useSendMessage;
