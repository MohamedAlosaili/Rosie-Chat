import React, { useEffect } from "react";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { nanoid } from "nanoid";
import {
  collection,
  setDoc,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from "firebase/firestore";

import { auth, db } from "rosie-firebase";
import { StatusMessage } from "components";
import { userDocTemplate } from "util";

const UserContext = React.createContext();

function UserContextProvider({ children }) {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);

  const [currentUser, loading, error] = useDocumentData(doc(db, "users", user.uid));

  // TODO: this need to be moved into separate hook
  useEffect(() => {
    if (currentUser && !currentUser.isOnline) {
      updateDocument({ isOnline: true })
    }

    return () => {
      // TODO: Firestore Rule prevent this action 
      // updateDocument({ isOnline: false })
    }
  }, [loading])

  useEffect(() => {
    const { displayName, email, photoURL, uid } = user;

    if (!currentUser && !loading) {
      (async function () {
        try {

          const publicChatId = "public_chat";
          const publicChatMessagesRef = collection(db, `chats/${publicChatId}/messages`);

          await setDoc(
            userRef,
            userDocTemplate({
              uid,
              displayName,
              email,
              photoURL,
              joinedOn: serverTimestamp()
            })
          );
          // Alert if user has been added
          const createdAt = serverTimestamp()
          const text = `${displayName} joined`
          await addDoc(
            publicChatMessagesRef, {
            id: nanoid(),
            type: "announce",
            message: { text },
            createdAt,
          }
          );
          await updateDoc(doc(db, "chats", publicChatId), {
            "lastMsg.message": text,
            "lastMsg.createdAt": createdAt,
            members: arrayUnion(uid)
          })
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [currentUser, loading]);

  if (loading) {
    return <StatusMessage message="Loading..." type="loading" />;
  }

  if (error) {
    return <StatusMessage message={error?.code} type="error" />;
  }

  async function updateDocument(newValues) {
    await updateDoc(userRef, newValues)
  }

  if (currentUser) {
    return (
      <UserContext.Provider value={{ currentUser, updateDocument }}>
        {children}
      </UserContext.Provider>
    );
  }
}

export { UserContextProvider, UserContext };
