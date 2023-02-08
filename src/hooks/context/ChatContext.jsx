import React, { useState } from "react";

import { chatDocTemplate } from "util";

const ChatContext = React.createContext();

function ChatContextProvider({ children }) {
  const [selectedChat, setSelectedChat] = useState(chatDocTemplate());

  console.log("Re-rendered <ChatContext />");

  function changeChat(chat) {
    setSelectedChat(chat);
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
