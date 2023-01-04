import React, { useState } from "react";

import { selectedChatTemplate } from "util";

const ChatContext = React.createContext();

function ChatContextProvider({ children }) {
  const [selectedChat, setSelectedChat] = useState(selectedChatTemplate());

  function changeChat(chat) {
    setSelectedChat(chat);
  }

  const contextValue = {
    selectedChat,
    changeChat,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export { ChatContextProvider, ChatContext };
