import { useContext, useEffect, useState } from "react";

import Conversation from "./Conversation";
import { selectChat } from "imgs";
import { ChatContext } from "hooks/context";
import { AnimatePresence } from "framer-motion";

function ChatBox() {
  const { selectedChat, emptyChat } = useContext(ChatContext);
  const [isChatOpen, setIsChatOpen] = useState(true)

  useEffect(() => {
    /* 
      Delaying emptyChat() until framer motion finish animating, if I don't do this 
      the chat will look empty (and the user can see that) before closing chat. 
      To make sure to reset isChatOpen after emptyChat() I use setTimeout  
    */
    if (!isChatOpen) {
      setTimeout(() => {
        emptyChat()
        setTimeout(() => setIsChatOpen(true), 0)
      }, 300)
    }
  }, [isChatOpen])

  return (
    <div className={`absolute md:relative top-0 left-full md:left-0 z-10 h-screen w-screen 
                    md:basis-[30rem] md:grow md:shrink
    `}>
      {selectedChat.id ? (
        <AnimatePresence mode="wait">
          {isChatOpen && (
            <Conversation
              setIsChatOpen={setIsChatOpen}
              key="conversation"
            />
          )}
        </AnimatePresence>
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
