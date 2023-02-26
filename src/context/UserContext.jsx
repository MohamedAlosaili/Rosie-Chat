import React, { useEffect, useState } from "react";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { nanoid } from "nanoid";
import {
  collection,
  setDoc,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

import useError from "hooks/useError";
import StatusMessage from "components/StatusMessage";
import { auth, db } from "rosie-firebase";
import { userDocTemplate } from "util/objectsTemplate";
import { AnimatePresence } from "framer-motion";

const UserContext = React.createContext();

function UserContextProvider({ children }) {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);

  const [currentUser, currentUserLoading, currentUserError] = useDocumentData(
    doc(db, "users", user.uid)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useError();

  useEffect(() => {
    if (!currentUser && !currentUserLoading) {
      setLoading(true);
      const createdAt = serverTimestamp();
      const text = `${user.displayName} joined`;

      Promise.all([
        createUserDoc(user),
        updatePublicChatDoc(text, createdAt, user.uid),
        memberJoinMessage(text, createdAt),
      ])
        .then(() => setLoading(false))
        .catch((error) => {
          setLoading(false);
          setError(error);
        });
    }
  }, [currentUser, currentUserLoading]);

  const createUserDoc = async ({ uid, displayName, email, photoURL }) => {
    await setDoc(
      userRef,
      userDocTemplate({
        uid,
        displayName,
        email,
        photoURL,
        joinedOn: serverTimestamp(),
      })
    );
  };

  const updatePublicChatDoc = async (message, createdAt, uid) => {
    await updateDoc(doc(db, "chats", "public_chat"), {
      lastMsg: {
        message,
        createdAt,
      },
      members: arrayUnion(uid),
    });
  };

  const memberJoinMessage = async (text, createdAt) => {
    const publicChatMessagesRef = collection(db, `chats/public_chat/messages`);
    await addDoc(publicChatMessagesRef, {
      id: nanoid(),
      type: "announce",
      message: { text },
      createdAt,
    });
  };

  if (currentUserLoading || loading) {
    return (
      <AnimatePresence>
        <StatusMessage message="Loading..." type="loading" />;
      </AnimatePresence>
    );
  }

  if (error || currentUserError) {
    return (
      <AnimatePresence>
        <StatusMessage
          message={error?.toString() ?? currentUserError?.code}
          type="error"
        />
      </AnimatePresence>
    );
  }

  async function updateDocument(newValues) {
    await updateDoc(userRef, newValues);
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
