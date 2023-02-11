import { lazy, Suspense, useContext, useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";

const Conversation = lazy(() => import("./Conversation"));
import selectChat from "imgs/select-chat.svg";
import { ChatContext } from "context/ChatContext";

function ChatBox() {
  const { selectedChat, emptyChat } = useContext(ChatContext);
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    /* 
      Delaying emptyChat() until framer motion finish animating, if I don't do this 
      the chat will look empty (and the user can see that) before closing chat. 
      To make sure to reset isChatOpen after emptyChat() I use setTimeout  
    */
    if (!isChatOpen) {
      setTimeout(() => {
        emptyChat();
        setTimeout(() => setIsChatOpen(true), 0);
      }, 300);
    }
  }, [isChatOpen]);

  return (
    <div
      className={`absolute top-0 left-full z-10 h-screen w-screen md:relative md:left-0 
                    md:shrink md:grow md:basis-[30rem]
    `}
    >
      {selectedChat.id ? (
        <Suspense>
          <AnimatePresence mode="wait">
            {isChatOpen && (
              <Conversation
                setIsChatOpen={setIsChatOpen}
                key={selectedChat.id}
              />
            )}
          </AnimatePresence>
        </Suspense>
      ) : (
        <div className="flex h-full flex-col items-center justify-center p-8">
          <img src={selectChat} alt="empty chat" className="w-full max-w-md" />
          <h3 className="mt-8 text-lg font-medium text-primary-300">
            Select a chat to start messaging
          </h3>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
