import React, { useEffect } from "react";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { nanoid } from "nanoid";
import {
  collection,
  setDoc,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "rosie-firebase";
import { StatusMessage } from "components";
import { userDocTemplate, messageDocTemplate } from "util";

const UserContext = React.createContext();

function UserContextProvider({ children }) {
  const user = auth.currentUser;
  const [userDoc, loading, error] = useDocumentData(doc(db, "users", user.uid));

  // TODO: this need to be moved into separate hook
  useEffect(() => {
    const { uid } = user;
    if (userDoc && !userDoc.isOnline) {
      updateDoc(doc(db, "users", uid), { isOnline: true })
    }

    return () => {
      // TODO: Firestore Rule prevent this action 
      updateDoc(doc(db, "users", uid), { isOnline: false })
    }
  }, [loading])

  useEffect(() => {
    const { displayName, email, photoURL, uid } = user;
    const userRef = doc(db, "users", uid);

    if (!userDoc && !loading) {
      (async function () {
        try {

          const publicChatId = "public_chat";
          const publicChat = (await getDoc(doc(db, "chats", publicChatId))).data()
          const publicChatMessages = collection(db, `chats/${publicChatId}/messages`);

          await setDoc(
            userRef,
            userDocTemplate({
              uid,
              displayName,
              email,
              photoURL,
              chats: [publicChatId],
              joinedOn: serverTimestamp()
            })
          );
          // Alert if user has been added
          const createdAt = serverTimestamp()
          const text = `${displayName} joined`
          await addDoc(
            publicChatMessages,
            messageDocTemplate({
              id: nanoid(),
              type: "announce",
              message: {
                text,
              },
              createdAt,
            })
          );
          await updateDoc(doc(db, "chats", publicChatId), {
            lastMsg: { message: text, createdAt },
            members: [...publicChat.members, uid]
          })
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [userDoc, loading]);

  if (loading || !userDoc) {
    return <StatusMessage message="Loading..." type="loading" />;
  }

  if (error) {
    return <StatusMessage message={error?.code} type="error" />;
  }

  return (
    <UserContext.Provider value={userDoc}>{children}</UserContext.Provider>
  );
}

export { UserContextProvider, UserContext };
