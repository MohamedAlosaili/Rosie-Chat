import { useState, useContext, useRef } from "react";
import { nanoid } from "nanoid";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, uploadBytes } from "firebase/storage";

import { db, storage, ref } from "rosie-firebase";
import { UserContext } from "hooks/context";
import { messageDocTemplate } from "util";

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
            console.log(fileInfo.size);
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

  async function fileData(file, id) {
    const name = file.name + id;
    const url = await uploadFileToStorage(file, name);

    return { name, url };
  }

  async function uploadFileToStorage(file, fileName) {
    const storageRef = ref(storage, `images/${fileName}`);

    await uploadBytes(storageRef, file);
    // Instead of retrieving the URL each time.
    // I choose to retrieve it once when it uploaded
    return await getDownloadURL(storageRef);
  }

  function resetValues() {
    setText({ [inputName]: "" });
    setLoading(false);
    scrollToBottom();
    setPreview && setPreview(null);
  }

  return [text, setText, sendMessage, loading, error, fileRef];
}

export default useSendMessage;
