import { useEffect, useRef, useContext, useState } from "react";

import { collection, query, orderBy, limitToLast } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/Io"
import { CgChevronLeft } from "react-icons/cg"

import Message from "features/ChatBox/Message";
import Form from "features/ChatBox/Form";
import { db } from "rosie-firebase";
import { defaultAvatar } from "imgs";
import { StatusMessage } from "components";
import { ChatContext, UserContext } from "hooks/context";
import { useEscape } from "hooks";

function Conversation({ setIsChatOpen }) {
  const { selectedChat, emptyChat } = useContext(ChatContext);
  const { currentUser } = useContext(UserContext);

  const [showScrollArrow, setShowScrollArrow] = useState(false)
  const [messagesLimit, setMessagesLimit] = useState({ prevMessagesLength: 25, limit: 25 });

  const isLimitChanged = useRef(false);
  const mostRecentMsgs = useRef(null);

  const q = query(
    collection(db, `chats/${selectedChat.id}/messages`),
    orderBy("createdAt"),
    limitToLast(messagesLimit.limit)
  );
  const [messages, isMessagesLoading, messagesError] = useCollectionData(q);

  useEscape(() => emptyChat())

  useEffect(() => {
    if (!isLimitChanged.current && !isMessagesLoading) {
      scrollToBottom()
    } else if (!isMessagesLoading) isLimitChanged.current = false
  }, [messages]);

  function increaseMessagesLimit(scrollTop) {
    if (
      scrollTop === 0 &&
      messagesLimit.prevMessagesLength <= messages.length
    ) {
      setMessagesLimit((prevLimit) => ({
        prevMessagesLength: prevLimit.limit + 25,
        limit: prevLimit.limit + 25,
      }));
      isLimitChanged.current = true
    }
  }

  function scrollToBottom() {
    mostRecentMsgs.current?.scrollIntoView(true)
  }

  function handleChatScroll(e) {
    const scrollTop = e.target.scrollTop
    const scrollHeight = e.target.scrollHeight
    const clinetHeight = e.target.clientHeight

    increaseMessagesLimit(scrollTop)

    if (scrollHeight - clinetHeight > scrollTop + 200) {
      setShowScrollArrow(true)
    } else {
      setShowScrollArrow(false)
    }
  }

  // TODO: endOne & endTwo have to change into clear names
  const directChatInfo = selectedChat?.endOne?.uid === currentUser.uid ? selectedChat?.endTwo : selectedChat?.endOne
  const chatInfo = selectedChat.isGroup ? selectedChat.chatInfo : directChatInfo

  return (
    <motion.div
      initial={{ left: "100%" }}
      animate={{ left: 0 }}
      exit={{ left: "100%" }}
      transition={{
        left: {
          type: "",
          duration: 0.3
        },
      }}
      className={`fixed md:static top-0 left-0 w-full h-full flex flex-col bg-[url('/src/imgs/chat/chat-bg.png')] bg-contain 
                  dark:bg-primary-900`
      }
    >
      <AnimatePresence mode="wait">
        {isMessagesLoading && (
          <StatusMessage
            message="Loading..."
            type="loading"
            location="absolute top-24"
          />
        )}
        {messagesError && (
          <StatusMessage message={messagesError?.code} type="error" />
        )}
      </AnimatePresence>
      <header className="flex items-center gap-4 p-4 pt-6 border-b border-primary-800 dark:bg-primary-900 relative z-10">
        <button
          onClick={() => setIsChatOpen(false)}
          className="flex md:hidden items-center font-medium dark:text-primary-200 mr-2"
        >
          <CgChevronLeft size={25} />
        </button>
        <img
          src={chatInfo.photoURL}
          alt={`${chatInfo.name} photo`}
          className="h-10 aspect-square object-cover rounded-50"
          onError={(e) => (e.target.src = defaultAvatar)}
        />
        <h3 className="font-medium dark:text-primary-200">
          {chatInfo.name}
        </h3>
      </header>
      {
        <main onScroll={handleChatScroll} className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar">
          <div className="max-w-2xl mx-auto">
            {messages?.map((msg, idx, msgs) => (
              <Message
                key={msg.id}
                prevMsgSender={idx > 0 ? msgs[idx - 1] : null}
                messageObject={msg}
                selectedChat={selectedChat}
              />
            ))
            }
            <div ref={mostRecentMsgs} className="h-px"></div>
          </div>
        </main>
      }
      <AnimatePresence>
        {showScrollArrow && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: 100 }}
            className={`
              transition-colors fixed bottom-24 right-6 h-12 w-12 rounded-full grid place-items-center cursor-pointer 
              text-primary-900 dark:text-primary-200
              bg-primary-100 dark:bg-primary-800
              hover:bg-primary-100/75 dark:hover:bg-primary-800/75
              focus:bg-primary-100/75 dark:focus:bg-primary-800/75
            `}
            onClick={scrollToBottom}
          >
            <IoIosArrowDown size={25} />
          </motion.button>
        )}
      </AnimatePresence>
      <footer className="w-full max-w-2xl mx-auto p-2 py-3 border-t dark:border-primary-800 z-10">
        <Form selectedChat={selectedChat} scrollToBottom={scrollToBottom} />
      </footer>
    </motion.div>
  );
}

export default Conversation;
