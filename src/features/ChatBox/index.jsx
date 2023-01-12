import { useContext } from "react";

import Conversation from "./Conversation";
import { selectChat } from "imgs";
import { ChatContext } from "hooks/context";

function ChatBox() {
  const { selectedChat } = useContext(ChatContext);

  return (
    <div className="basis-[30rem] grow shrink">
      {selectedChat.id ? (
        <Conversation />
      ) : (
        <div className="h-full flex flex-col justify-center items-center p-8">
          <img src={selectChat} alt="empty chat" className="w-full max-w-md" />
          <h3 className="text-lg font-medium mt-8 text-primary-300">
            Select a chat to start messaging
          </h3>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
