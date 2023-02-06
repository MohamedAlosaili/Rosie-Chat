import { useEffect, useRef, useContext, useState } from "react";

import { collection, query, orderBy, limitToLast } from "firebase/firestore";
import {
  useCollectionData,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/Io";
import { CgChevronLeft } from "react-icons/cg";
import { nanoid } from "nanoid";

import Message from "features/ChatBox/Message";
import Form from "features/ChatBox/Form";
import { db } from "rosie-firebase";
import { defaultAvatar } from "imgs";
import { StatusMessage, SkeletonLoader } from "components";
import { ChatContext } from "hooks/context";
import { useEscape } from "hooks";

function Conversation({ setIsChatOpen }) {
  const { selectedChat, emptyChat } = useContext(ChatContext);

  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [messagesLimit, setMessagesLimit] = useState({
    prevMessagesLength: 25,
    limit: 25,
  });
  const [greeting, setGreeting] = useState("");

  const isLimitChanged = useRef(false);
  const mostRecentMsgs = useRef(null);

  const messagesQuery = query(
    collection(db, `chats/${selectedChat.id}/messages`),
    orderBy("createdAt"),
    limitToLast(messagesLimit.limit)
  );
  const [messages, isMessagesLoading, messagesError] =
    useCollectionData(messagesQuery);

  useEscape(() => emptyChat());

  useEffect(() => {
    if (!isLimitChanged.current && !isMessagesLoading) {
      scrollToBottom();
    } else if (!isMessagesLoading) isLimitChanged.current = false;

    if (messages?.length > 0) {
      setGreeting("");
    }
  }, [messages]);

  function increaseMessagesLimit(scrollTop) {
    if (
      scrollTop === 0 &&
      messagesLimit.prevMessagesLength <= messages?.length
    ) {
      setMessagesLimit((prevLimit) => ({
        prevMessagesLength: prevLimit.limit + 25,
        limit: prevLimit.limit + 25,
      }));
      isLimitChanged.current = true;
    }
  }

  function scrollToBottom() {
    mostRecentMsgs.current?.scrollIntoView(true);
  }

  function handleChatScroll(e) {
    const scrollTop = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight;
    const clinetHeight = e.target.clientHeight;

    increaseMessagesLimit(scrollTop);

    if (scrollHeight - clinetHeight > scrollTop + 200) {
      setShowScrollArrow(true);
    } else {
      setShowScrollArrow(false);
    }
  }

  return (
    <motion.div
      initial={{ left: "100%" }}
      animate={{ left: 0 }}
      exit={{ left: "100%" }}
      transition={{
        left: {
          type: "",
          duration: 0.3,
        },
      }}
      className={`fixed top-0 left-0 flex h-full w-full flex-col bg-[url('/src/imgs/chat/chat-bg.png')] bg-contain dark:bg-primary-900 
                  md:static`}
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
      <header className="relative z-10 flex items-center gap-4 border-b border-primary-800 p-4 pt-6 dark:bg-primary-900">
        <button
          onClick={() => setIsChatOpen(false)}
          className="mr-2 flex items-center font-medium dark:text-primary-200 md:hidden"
        >
          <CgChevronLeft size={25} />
        </button>
        <div className="aspect-square w-10 overflow-hidden rounded-50">
          {selectedChat?.chatPhotoURL ? (
            <img
              src={selectedChat?.chatPhotoURL}
              alt={`${selectedChat?.chatName} photo`}
              className="aspect-square object-cover"
              onError={(e) => (e.target.src = defaultAvatar)}
            />
          ) : (
            <SkeletonLoader.Img />
          )}
        </div>
        <div>
          {selectedChat?.chatName ? (
            <h3 className="font-medium dark:text-primary-200">
              {selectedChat?.chatName ?? ""}
            </h3>
          ) : (
            <SkeletonLoader.Div width="10rem" />
          )}
        </div>
      </header>
      {
        <main
          onScroll={handleChatScroll}
          className="scrollbar flex-1 overflow-y-auto overflow-x-hidden p-4"
        >
          {messages?.length > 0 ? (
            <div className="mx-auto max-w-2xl">
              {messages?.map((msg, idx, msgs) => (
                <Message
                  key={msg.id}
                  prevMsgSender={idx > 0 ? msgs[idx - 1] : null}
                  messageObject={msg}
                  selectedChat={selectedChat}
                />
              ))}
              <div ref={mostRecentMsgs} className="h-px"></div>
            </div>
          ) : (
            !isMessagesLoading && (
              <div
                onClick={() =>
                  setGreeting(
                    `Hi ${selectedChat?.chatName ?? ""}${
                      selectedChat.isGroup ? " members" : ""
                    }`
                  )
                }
                className="absolute top-1/2 left-1/2 w-max -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-xl p-4 text-center transition-colors dark:bg-primary-800 dark:text-primary-200 dark:hover:bg-primary-800/75"
              >
                <h3 className="font-semibold">No messages here yet...</h3>
                <p>
                  Tap here to say Hi to{" "}
                  <span className="font-semibold dark:text-primary-50">
                    {selectedChat?.chatName ?? ""}{" "}
                    {selectedChat.isGroup && "members"}
                  </span>
                </p>
                <img
                  src="https://media.tenor.com/XyfkuomEwj4AAAAi/hello.gif"
                  alt="Greeting gif"
                  className="mx-auto block aspect-square w-60 drop-shadow-sm"
                />
              </div>
            )
          )}
        </main>
      }
      <AnimatePresence>
        {showScrollArrow && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: 100 }}
            className={`
              fixed bottom-24 right-6 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary-100 
              text-primary-900 transition-colors
              hover:bg-primary-100/75 focus:bg-primary-100/75
              dark:bg-primary-800 dark:text-primary-200
              dark:hover:bg-primary-800/75 dark:focus:bg-primary-800/75
            `}
            onClick={scrollToBottom}
          >
            <IoIosArrowDown size={25} />
          </motion.button>
        )}
      </AnimatePresence>
      <footer className="z-10 mx-auto w-full max-w-2xl border-t p-2 py-3 dark:border-primary-800">
        {/* unique key will ensure that Form re-render on every changing in ChatContext */}
        <Form
          key={nanoid()}
          selectedChat={selectedChat}
          scrollToBottom={scrollToBottom}
          greeting={greeting}
        />
      </footer>
    </motion.div>
  );
}

export default Conversation;
