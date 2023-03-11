import {
  memo,
  useEffect,
  useRef,
  useContext,
  useState,
  lazy,
  Suspense,
} from "react";

import { collection, query, orderBy, limitToLast } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/Io";
import { CgChevronLeft } from "react-icons/cg";

import useEscape from "hooks/useEscape";
import Message from "features/ChatBox/Message";
import Form from "features/ChatBox/Form";
import StatusMessage from "components/StatusMessage";
import SkeletonLoader from "components/SkeletonLoader";
import Image from "components/Image";
import { db } from "rosie-firebase";
import { UserContext } from "context/UserContext";
import { ChatContext } from "context/ChatContext";

const EditGroupInfoModal = lazy(() => import("./EditGroupInfoModal"));

function Conversation({ setIsChatOpen }) {
  const { currentUser } = useContext(UserContext);
  const { selectedChat, emptyChat, changeChat } = useContext(ChatContext);

  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);

  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [messagesLimit, setMessagesLimit] = useState({
    prevMessagesLength: 25,
    limit: 25,
  });

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

  const setGreeting = !isMessagesLoading && messages?.length === 0;

  const receiverId = selectedChat.members
    .filter((memberId) => memberId !== currentUser.uid)
    .join("");
  const chatInfo = selectedChat.isGroup
    ? selectedChat.chatInfo
    : selectedChat[receiverId];

  const isGroupAdmin =
    selectedChat.isGroup && selectedChat?.admin === currentUser.uid;

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
      className={`fixed top-0 left-0 flex h-full w-full flex-col bg-primary-200 bg-[url('/assets/imgs/chat-bg.png')] bg-contain dark:bg-primary-900 
                  md:static`}
    >
      <AnimatePresence mode="wait">
        {isMessagesLoading && (
          <StatusMessage message="Loading..." type="loading" />
        )}
        {messagesError && (
          <StatusMessage message={messagesError?.code} type="error" />
        )}
      </AnimatePresence>
      <header
        onClick={() => (isGroupAdmin ? setShowGroupInfoModal(true) : null)}
        className={`relative z-10 flex items-center gap-4 border-b border-primary-400/50 bg-primary-200 p-4 pt-6 dark:border-primary-800 dark:bg-primary-900 ${
          isGroupAdmin ? "cursor-pointer" : ""
        }`}
      >
        <Suspense
          fallback={<StatusMessage message="Loading..." type="loading" />}
        >
          <AnimatePresence>
            {showGroupInfoModal && (
              <EditGroupInfoModal
                setShowGroupInfoModal={setShowGroupInfoModal}
                selectedChat={selectedChat}
                currentUser={currentUser}
                changeChat={changeChat}
              />
            )}
          </AnimatePresence>
        </Suspense>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsChatOpen(false);
          }}
          className="mr-2 flex h-full items-center font-medium dark:text-primary-200 md:hidden"
        >
          <CgChevronLeft size={25} />
        </button>
        <div className="aspect-square w-10 overflow-hidden rounded-full">
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
            <h3 className="font-semibold text-primary-900 dark:text-primary-200">
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
          {messages?.length > 0 && (
            <div className="mx-auto max-w-2xl">
              {messages?.map((msg, idx, msgs) => (
                <Message
                  key={msg.id}
                  prevMsgSenderId={idx > 0 ? msgs[idx - 1]?.senderId : null}
                  msgObj={msg}
                  selectedChat={selectedChat}
                  isLastMsg={msgs.length === idx + 1}
                />
              ))}
              <div ref={mostRecentMsgs} className="h-px"></div>
            </div>
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
              fixed bottom-24 right-6 z-10 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary-300
              text-primary-900 transition-colors
              hover:bg-primary-300/75 focus:bg-primary-300/75
              dark:bg-primary-800 dark:text-primary-200
              dark:hover:bg-primary-800/75 dark:focus:bg-primary-800/75
            `}
            onClick={scrollToBottom}
          >
            <IoIosArrowDown size={25} />
          </motion.button>
        )}
      </AnimatePresence>
      <footer className="z-10 mx-auto w-full max-w-2xl border-t border-primary-400/50 p-2 py-3 dark:border-primary-800">
        <Form
          scrollToBottom={scrollToBottom}
          selectedChat={{ ...selectedChat, ...chatInfo }}
          setGreeting={setGreeting}
        />
      </footer>
    </motion.div>
  );
}

export default memo(Conversation);
