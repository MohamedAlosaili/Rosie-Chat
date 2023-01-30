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
  const [currentUser, loading, error] = useDocumentData(doc(db, "users", user.uid));

  // TODO: this need to be moved into separate hook
  useEffect(() => {
    if (currentUser && !currentUser.isOnline) {

      updateDocument({ isOnline: true })
    }

    return () => {
      // TODO: Firestore Rule prevent this action 
      updateDocument({ isOnline: false })
    }
  }, [loading])

  useEffect(() => {
    const { displayName, email, photoURL, uid } = user;
    const userRef = doc(db, "users", uid);

    if (!currentUser && !loading) {
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
          await updateDocument({
            lastMsg: { message: text, createdAt },
            members: [...publicChat.members, uid]
          })
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [currentUser, loading]);

  if (loading || !currentUser) {
    return <StatusMessage message="Loading..." type="loading" />;
  }

  if (error) {
    return <StatusMessage message={error?.code} type="error" />;
  }

  async function updateDocument(newValues) {
    console.log("currentUser", currentUser)
    await updateDoc(doc(db, "users", user.uid), newValues)
  }

  return (
    <UserContext.Provider value={{ currentUser, updateDocument }}>{children}</UserContext.Provider>
  );
}

export { UserContextProvider, UserContext };
