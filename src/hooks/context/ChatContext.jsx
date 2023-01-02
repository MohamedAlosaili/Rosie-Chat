import React, { useState } from "react";

import { selectedChatObj } from "util";

const ChatContext = React.createContext();

function ChatContextProvider({ children }) {
  const [selectedChat, setSelectedChat] = useState(selectedChatObj);

  function changeChat(chat) {
    setSelectedChat(chat);
  }
  console.log(selectedChat);
  const contextValue = {
    selectedChat,
    changeChat,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export { ChatContextProvider, ChatContext };
