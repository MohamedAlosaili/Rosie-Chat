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

  function sendMessage(e) {
    e.preventDefault();

    const msgHasFile = fileRef.current;
    const msgHasText = text[inputName] !== "";
    // Messages of type file shouldn't have text but they should have a file
    if (msgHasText || msgHasFile) {
      setLoading(true);

      const messagesRef = collection(
        db,
        `${selectedChat.isGroup ? "groups" : "direct"}/${
          selectedChat.id
        }/messages`
      );

      addMessageDocument(messagesRef, msgHasFile)
        .then(() => resetValues())
        .catch((error) => console.log(error));
    }
  }

  async function addMessageDocument(messagesRef, file) {
    const { uid, photoURL, displayName } = userDoc;
    try {
      const id = nanoid();
      const type = file ? "file" : "text";

      let fileURL = null;
      let fileName = null;
      if (file) {
        // We need fileName in case we want to delete the file
        // Using msgId with file.name to keep file name unique
        fileName = file.name + id;
        fileURL = await uploadFileToStorage(file, fileName);
      }

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
            file: { name: fileName, url: fileURL },
          },
          createdAt: serverTimestamp(),
        })
      );
    } catch (error) {
      console.log(error);
    }
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

  return [text, setText, sendMessage, loading, fileRef];
}

export default useSendMessage;
