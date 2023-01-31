import { memo, useContext } from "react";
import PropTypes from "prop-types";

import { ChatContext, UserContext } from "hooks/context";

const Chat = ({ chat, isSelected }) => {
  const { currentUser } = useContext(UserContext);
  const { changeChat } = useContext(ChatContext);

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

  // TODO: endOne & endTwo have to change into clear names
  const directChatInfo = chat?.endOne?.uid === currentUser.uid ? chat?.endTwo : chat?.endOne
  const chatInfo = chat.isGroup ? chat.chatInfo : directChatInfo

  return (
    <li
      onClick={() => changeChat(chat)}
      className={`grid grid-cols-[auto_1fr] text-sm rounded-xl gap-4 p-4 mb-2 last:mb-0 cursor-pointer transition-colors overflow-hidden select-none 
                      relative z-10 before:absolute before:inset-0 before:opacity-50 before:-z-10 before:transition-colors 
                      dark:active:before:bg-primary-700 dark:hover:before:bg-primary-800 ${isSelected ? "dark:bg-primary-800" : ""
        }`}
    >
      <img
        src={chatInfo.photoURL}
        alt="chat image"
        className="w-14 h-14 object-cover rounded-50"
      />
      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-base font-medium dark:text-primary-200 truncate">
            {chatInfo.name}
          </h3>
          <time className="whitespace-nowrap">
            {timeFormater.format(chat.lastMsg.createdAt?.toDate())}
          </time>
        </div>
        <div className="flex justify-between items-center gap-2">
          <p className="truncate">{
            (chat.lastMsg.message === "Say hi to " && !chat.lastMsg.uid)
              ? chat.lastMsg.message + chatInfo.name + " 👋"
              : chat.lastMsg.message
          }</p>
          {chat?.unreadMsgs > 0 && (
            <span className="bg-accent text-xs dark:text-primary-200 rounded-full py-[0.3rem] px-2 font-semibold leading-none">
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
    photoURL: PropTypes.string,
    isGroup: PropTypes.bool,
    unreadMsgs: PropTypes.number,
    name: PropTypes.string,
    id: PropTypes.string,
    lastMsg: PropTypes.shape({
      uid: PropTypes.oneOf([PropTypes.string, PropTypes.symbol]),
      message: PropTypes.string,
      createdAt: PropTypes.object,
    }),
  }),
  isSelected: PropTypes.bool,
};

Chat.defaultProps = {
  unreadMsg: 0,
  isSelected: false,
};

export default memo(Chat);
