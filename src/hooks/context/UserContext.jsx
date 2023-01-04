import React, { useEffect } from "react";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { nanoid } from "nanoid";
import {
  collection,
  setDoc,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "rosie-firebase";
import { StatusMessage } from "components";
import { userDocTemplate, messageDocTemplate } from "util";

const UserContext = React.createContext();

function UserContextProvider({ children }) {
  const user = auth.currentUser;
  const [userDoc, loading, error] = useDocumentData(doc(db, "users", user.uid));

  useEffect(() => {
    if (!userDoc && !loading) {
      (async function () {
        try {
          const { displayName, email, photoURL, uid } = user;

          const chatId = "public_chat";
          const publicChat = (await getDoc(doc(db, "groups", chatId))).data();
          const publicChatMessages = collection(
            db,
            `groups/${chatId}/messages`
          );
          const usersRef = collection(db, "users");

          await setDoc(
            doc(usersRef, uid),
            userDocTemplate({
              uid,
              displayName,
              email,
              photoURL,
              chats: [publicChat],
            })
          );
          // Alert if user has been added
          await addDoc(
            publicChatMessages,
            messageDocTemplate({
              id: nanoid(),
              type: "announce",
              message: {
                text: `${displayName} joined`,
                file: {
                  name: null,
                  text: null,
                },
              },
              createdAt: serverTimestamp(),
            })
          );
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
    <UserContext.Provider value={[userDoc, loading, error]}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContextProvider, UserContext };
