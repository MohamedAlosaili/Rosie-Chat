import { memo, useContext } from "react";
import PropTypes from "prop-types";

import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { AnimatePresence } from "framer-motion";

import Image from "components/Image";
import StatusMessage from "components/StatusMessage";
import { ChatContext } from "context/ChatContext";
import { db } from "rosie-firebase";

const Chat = ({ chat, currentUserId, isSelected }) => {
  const { changeChat } = useContext(ChatContext);

  const receiverId = chat.members
    .filter((memberId) => memberId !== currentUserId)
    .join("");
  const chatInfo = chat.isGroup ? chat.chatInfo : chat[receiverId];

  // I found this workaround solution to query dynamic map fields without an index
  // on stack Overflow: https://stackoverflow.com/a/50980337/17077666
  const unreadMsgsQuery = query(
    collection(db, `chats/${chat.id}/messages`),
    where(`readBy.${currentUserId}`, "==", false)
  );
  const [unreadMsgs, , unreadMsgsError] = useCollectionData(unreadMsgsQuery);

  // TODO: This block needs some refactor
  const today = new Date();
  const messageDate = new Date(chat.lastMsg.createdAt?.toDate());
  const timeDiffrence = Math.round((today - messageDate) / 1000 / 60 / 60 / 24);
  let options = {};
  if (timeDiffrence < 1) {
    options.hour = "numeric";
    options.minute = "numeric";
  } else if (timeDiffrence < 7) {
    options.weekday = "short";
  }
  const timeFormater = new Intl.DateTimeFormat("en-US", options);

  return (
    <li
      onClick={() => !isSelected && changeChat(chat)}
      className={`relative z-10 mb-2 grid cursor-pointer select-none grid-cols-[auto_1fr_auto] items-center gap-4 overflow-hidden rounded-xl p-4 text-sm transition-colors last:mb-0 
                       ${
                         isSelected
                           ? "bg-primary-300 dark:bg-primary-800"
                           : "hover:bg-primary-300/50 active:bg-primary-400/50 dark:hover:bg-primary-800/50 dark:active:bg-primary-700/50"
                       }`}
    >
      <AnimatePresence>
        {unreadMsgsError && (
          <StatusMessage type="error" message={unreadMsgsError?.toString()} />
        )}
      </AnimatePresence>
      <Image
        img={{ url: chatInfo.photoURL, name: chatInfo.name }}
        className="h-14 w-14 rounded-full"
      />
      <div className="w-full overflow-hidden">
        <h3 className="mb-2 truncate text-base font-medium text-primary-900 dark:text-primary-200">
          {chatInfo.name}
        </h3>
        {chat.lastMsg.message === "Say hi to " && !chat.lastMsg?.senderId ? (
          <p className="truncate">
            {chat.lastMsg.message + chatInfo.name + " 👋"}
          </p>
        ) : (
          <p className="truncate">
            {chat.lastMsg?.senderId === currentUserId ? (
              <span>{`You: ${chat.lastMsg.message}`}</span>
            ) : (
              <span>
                {chat.isGroup && (chat.lastMsg?.senderName ?? "")}
                {chat.lastMsg?.senderName ? ": " : ""}
                {chat.lastMsg.message}
              </span>
            )}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <time className="whitespace-nowrap">
          {timeFormater.format(chat.lastMsg.createdAt?.toDate())}
        </time>
        {unreadMsgs?.length > 0 && (
          <div className="rounded-full bg-accent py-[0.3rem] px-2 text-xs font-semibold leading-none text-white">
            {unreadMsgs.length <= 99 ? unreadMsgs.length : "+99"}
          </div>
        )}
      </div>
    </li>
  );
};

Chat.proptypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isGroup: PropTypes.bool.isRequired,
    lastMsg: PropTypes.shape({
      uid: PropTypes.oneOf([PropTypes.string, PropTypes.symbol]),
      message: PropTypes.string,
      createdAt: PropTypes.object,
    }),
    ["chatInfo"]: PropTypes.shape({
      name: PropTypes.string,
      photoURL: PropTypes.string,
    }),
  }),
  isSelected: PropTypes.bool,
};

Chat.defaultProps = {
  isSelected: false,
};

export default memo(Chat);
