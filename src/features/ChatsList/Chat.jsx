import { memo, useContext } from "react";
import PropTypes from "prop-types";

import Image from "components/Image";
import { ChatContext } from "context/ChatContext";

const Chat = ({ chat, currentUserId, isSelected }) => {
  const { changeChat } = useContext(ChatContext);

  const receiverId = chat.members
    .filter((memberId) => memberId !== currentUserId)
    .join("");
  const chatInfo = chat.isGroup ? chat.chatInfo : chat[receiverId];

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
      className={`relative z-10 mb-2 grid cursor-pointer select-none grid-cols-[auto_1fr] gap-4 overflow-hidden rounded-xl p-4 text-sm 
                      transition-colors before:absolute before:inset-0 before:-z-10 before:opacity-50 before:transition-colors last:mb-0 
                      dark:hover:before:bg-primary-800 dark:active:before:bg-primary-700 ${
                        isSelected ? "dark:bg-primary-800" : ""
                      }`}
    >
      <Image
        img={{ url: chatInfo.photoURL, name: chatInfo.name }}
        className="aspect-square w-14 rounded-full"
      />
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-medium dark:text-primary-200">
            {chatInfo.name}
          </h3>
          <time className="whitespace-nowrap">
            {timeFormater.format(chat.lastMsg.createdAt?.toDate())}
          </time>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate">
            {chat.lastMsg.message === "Say hi to " && !chat.lastMsg.uid
              ? chat.lastMsg.message + chatInfo.name + " 👋"
              : chat.lastMsg.message}
          </p>
          {chat?.unreadMsgs > 0 && (
            <span className="rounded-full bg-accent py-[0.3rem] px-2 text-xs font-semibold leading-none dark:text-primary-200">
              {chat.unreadMsgs}
            </span>
          )}
        </div>
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
