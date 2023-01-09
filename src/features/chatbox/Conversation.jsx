import { useEffect, useRef, useContext, useState } from "react";

import { collection, query, orderBy, limitToLast } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { AnimatePresence } from "framer-motion";

import { db } from "rosie-firebase";
import { defaultAvatar } from "imgs";
import Message from "./Message";
import Form from "./Form";
import { StatusMessage } from "components";
import { ChatContext } from "hooks/context";
import { selectedChatTemplate } from "util";

function Conversation() {
  const { selectedChat, changeChat } = useContext(ChatContext);
  const [messagesLimit, setMessagesLimit] = useState({
    prevMessagesLength: 25,
    limit: 25,
  });

  const q = query(
    collection(
      db,
      `${selectedChat.isGroup ? "groups" : "direct"}/${
        selectedChat.id
      }/messages`
    ),
    orderBy("createdAt"),
    limitToLast(messagesLimit.limit)
  );
  const [messages, isMessagesLoading, messagesError] = useCollectionData(q);
  const mostRecentMsgs = useRef();

  useEffect(() => {
    window.addEventListener("keydown", closeConversation);
    return () => window.removeEventListener("keydown", closeConversation);
  }, []);

  // TODO: needs some improvments (There is a better way)
  useEffect(() => {
    // scrollToBottom("auto");
  }, [messages]);

  function closeConversation(e) {
    if (e.key === "Escape") {
      changeChat(selectedChatTemplate());
    }
  }

  function changeMessagesLimit(e) {
    const scrollTop = e.target.scrollTop;
    if (
      scrollTop === 0 &&
      messagesLimit.prevMessagesLength <= messages.length
    ) {
      setMessagesLimit((prevLimit) => ({
        prevMessagesLength: prevLimit.limit + 25,
        limit: prevLimit.limit + 25,
      }));
    }
  }

  function scrollToBottom(behavior = "smooth") {
    // If a user closes the chat using ESC while a message
    // is in sending state the current will be null
    mostRecentMsgs.current?.scrollIntoView({ behavior });
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
      <header className="flex items-center gap-4 p-4 pt-6 border-b border-primary-800 dark:bg-primary-900 relative z-20">
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
      <main
        onScroll={changeMessagesLimit}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar"
      >
        <div className="max-w-2xl mx-auto">
          {messages?.map((msg, idx, msgs) => (
            <Message
              key={msg.id}
              prevMsgSender={idx > 0 ? msgs[idx - 1] : null}
              messageObject={msg}
              selectedChat={selectedChat}
            />
          ))}
          <div ref={mostRecentMsgs}></div>
        </div>
      </main>
      <footer className="w-full max-w-2xl mx-auto p-2 py-3 border-t dark:border-primary-800">
        <Form selectedChat={selectedChat} scrollToBottom={scrollToBottom} />
      </footer>
    </div>
  );
}

export default Conversation;
