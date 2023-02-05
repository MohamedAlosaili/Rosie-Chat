import { memo, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { doc, getDoc } from "firebase/firestore";

import { ChatContext, UserContext } from "hooks/context";
import { db } from "rosie-firebase";
import { SkeletonLoader } from "components";

const Chat = ({ chat, isSelected }) => {
  const { currentUser } = useContext(UserContext);
  const { selectedChat, changeChat } = useContext(ChatContext);

  const [chatInfo, setChatInfo] = useState(() => ({
    chatName: chat.chatName,
    chatPhotoURL: chat.chatPhotoURL,
  }));

  useEffect(() => {
    if (!chat.isGroup) {
      receiverInfo().then((chatInfo) => setChatInfo(chatInfo));
    }
  }, []);

  async function receiverInfo() {
    const receiverId = chat.members.filter(
      (memberId) => memberId !== currentUser.uid
    )[0];
    const receiverRef = doc(db, "users", receiverId);

    try {
      const userInfo = (await getDoc(receiverRef)).data();
      return { chatName: userInfo.displayName, chatPhotoURL: userInfo.photoURL };
    } catch (error) {
      console.log(error);
    }
  }

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

  if (!chatInfo.chatName) {
    return <SkeletonLoader.Card isChat={true} />
  }

  return (
    <li
      onClick={() => selectedChat.id !== chat.id && changeChat(chat)}
      className={`grid grid-cols-[auto_1fr] text-sm rounded-xl gap-4 p-4 mb-2 last:mb-0 cursor-pointer transition-colors overflow-hidden select-none 
                      relative z-10 before:absolute before:inset-0 before:opacity-50 before:-z-10 before:transition-colors 
                      dark:active:before:bg-primary-700 dark:hover:before:bg-primary-800 ${isSelected ? "dark:bg-primary-800" : ""
        }`}
    >
      <img
        src={chatInfo.chatPhotoURL}
        alt={`${chatInfo.chatName} ${chat.isGroup ? "group" : ""} photo`}
        className="w-14 aspect-square object-cover rounded-full"
      />
      <div>
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-base font-medium dark:text-primary-200 truncate">
            {chatInfo.chatName}
          </h3> 
          <time className="whitespace-nowrap">
            {timeFormater.format(chat.lastMsg.createdAt?.toDate())}
          </time>
        </div>
        <div className="flex justify-between items-center gap-2">
          <p className="truncate">{
            (chat.lastMsg.message === "Say hi to " && !chat.lastMsg.uid)
              ? chat.lastMsg.message + chatInfo.chatName + " 👋"
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
