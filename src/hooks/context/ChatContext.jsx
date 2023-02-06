import React, { useContext, useEffect, useState } from "react";

import { getDoc, doc } from "firebase/firestore";

import { chatDocTemplate } from "util";
import { db } from "rosie-firebase";
import { UserContext } from "hooks/context/UserContext";

const ChatContext = React.createContext();

function ChatContextProvider({ children }) {
  const { currentUser } = useContext(UserContext);
  const [selectedChat, setSelectedChat] = useState(chatDocTemplate());

  useEffect(() => {
    if (selectedChat.id && !selectedChat.isGroup && !selectedChat.chatName) {
      receiverInfo().then((data) => {
        console.log(data);
        setSelectedChat((prevSelected) => ({ ...prevSelected, ...data }));
      });
    }
  }, [selectedChat]);

  function changeChat(chat) {
    setSelectedChat(chat);
  }

  async function receiverInfo() {
    if (!selectedChat.id) return;

    const receiverId = selectedChat?.members.filter(
      (memberId) => memberId !== currentUser.uid
    )[0];
    const receiverRef = doc(db, "users", receiverId);

    try {
      const { displayName, photoURL, ...userInfo } = (
        await getDoc(receiverRef)
      ).data();
      return { chatName: displayName, chatPhotoURL: photoURL, ...userInfo };
    } catch (error) {
      console.log(error);
    }
  }

  function emptyChat() {
    setSelectedChat(chatDocTemplate());
  }

  const contextValue = {
    selectedChat,
    changeChat,
    emptyChat,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export { ChatContextProvider, ChatContext };
