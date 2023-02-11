import { memo, useEffect, useRef, useContext, useState } from "react";

import { collection, query, orderBy, limitToLast } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/Io";
import { CgChevronLeft } from "react-icons/cg";

import Message from "features/ChatBox/Message";
import Form from "features/ChatBox/Form";
import useEscape from "hooks/useEscape";
import StatusMessage from "components/StatusMessage";
import SkeletonLoader from "components/SkeletonLoader";
import Image from "components/Image";
import { db } from "rosie-firebase";
import { UserContext } from "context/UserContext";
import { ChatContext } from "context/ChatContext";

function Conversation({ setIsChatOpen }) {
  const { currentUser } = useContext(UserContext);
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
    if (messages?.length > 0) {
      setGreeting("");
    }
  }, []);

  useEffect(() => {
    if (!isLimitChanged.current && !isMessagesLoading) {
      scrollToBottom();
    } else if (!isMessagesLoading) isLimitChanged.current = false;
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
      !showScrollArrow && setShowScrollArrow(true);
    } else {
      showScrollArrow && setShowScrollArrow(false);
    }
  }

  const receiverId = selectedChat.members
    .filter((memberId) => memberId !== currentUser.uid)
    .join("");
  const chatInfo = selectedChat.isGroup
    ? selectedChat.chatInfo
    : selectedChat[receiverId];

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
      className={`fixed top-0 left-0 flex h-full w-full flex-col bg-[url('/src/imgs/chat-bg.png')] bg-contain dark:bg-primary-900 
                  md:static`}
    >
      <AnimatePresence mode="wait">
        {/* {isMessagesLoading && (
          <StatusMessage
            message="Loading..."
            type="loading"
            location="absolute top-24"
          />
        )} */}
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
          {chatInfo.photoURL ? (
            <Image
              img={{ url: chatInfo.photoURL, name: chatInfo.name }}
              className="aspect-square object-cover"
            />
          ) : (
            <SkeletonLoader.Img />
          )}
        </div>
        <div>
          {chatInfo.name ? (
            <h3 className="font-medium dark:text-primary-200">
              {chatInfo.name ?? ""}
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
                  msgObj={msg}
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
                    `Hi ${chatInfo.name ?? ""}${
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
                    {chatInfo.name ?? ""} {selectedChat.isGroup && "members"}
                  </span>
                </p>
                <Image
                  img={{
                    url: "https://media.tenor.com/XyfkuomEwj4AAAAi/hello.gif",
                    name: "Greeting gif",
                  }}
                  className="mx-auto block aspect-square w-60 !bg-transparent"
                />
              </div>
            )
          )}
        </main>
      }
      <AnimatePresence>
        {showScrollArrow && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 10 }}
            className={`
              fixed bottom-24 right-6 z-10 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary-100
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
        <Form
          key={selectedChat.id}
          scrollToBottom={scrollToBottom}
          greeting={greeting}
        />
      </footer>
    </motion.div>
  );
}

export default memo(Conversation);
