import { useEffect, useRef, useContext, useState } from "react";

import { collection, query, orderBy, limitToLast } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { AnimatePresence, motion } from "framer-motion";

import Message from "features/ChatBox/Message";
import Form from "features/ChatBox/Form";
import { db } from "rosie-firebase";
import { defaultAvatar } from "imgs";
import { StatusMessage } from "components";
import { ChatContext } from "hooks/context";
import { useEscape } from "hooks";
import { selectedChatTemplate } from "util";

function Conversation() {
  const { selectedChat, changeChat } = useContext(ChatContext);

  const [showScrollArrow, setShowScrollArrow] = useState(false)
  const [messagesLimit, setMessagesLimit] = useState({ prevMessagesLength: 25, limit: 25 });

  const isLimitChanged = useRef(false);
  const mostRecentMsgs = useRef(null);

  const chatType = selectedChat.isGroup ? "groups" : "direct"
  const q = query(
    collection(db, `${chatType}/${selectedChat.id}/messages`),
    orderBy("createdAt"),
    limitToLast(messagesLimit.limit)
  );
  const [messages, isMessagesLoading, messagesError] = useCollectionData(q);

  useEscape(() => changeChat(selectedChatTemplate()))

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

  return (
    <div className="h-full flex flex-col bg-[url('/src/imgs/chat/chat-bg.png')] bg-contain relative">
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
        <img
          src={selectedChat.photoURL}
          alt={`${selectedChat.name} photo`}
          className="h-10 aspect-square object-cover rounded-50"
          onError={(e) => (e.target.src = defaultAvatar)}
        />
        <h3 className="font-medium dark:text-primary-200">
          {selectedChat.name}
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
            className="fixed bottom-24 right-6 bg-primary-800 h-12 w-12 rounded-full grid place-items-center cursor-pointer"
            onClick={scrollToBottom}
          >
            <FontAwesomeIcon icon={faArrowDown} size={"lg"} />
          </motion.button>
        )}
      </AnimatePresence>
      <footer className="w-full max-w-2xl mx-auto p-2 py-3 border-t dark:border-primary-800 z-10">
        <Form selectedChat={selectedChat} scrollToBottom={scrollToBottom} />
      </footer>
    </div>
  );
}

export default Conversation;
