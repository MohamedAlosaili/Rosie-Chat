import { memo } from "react";

import PropTypes from "prop-types";

import { auth } from "rosie-firebase";
import uniqolor from "uniqolor";

const Message = ({ messageObject, prevMsgSender, selectedChat }) => {
  const { type, uid, message, createdAt, displayName, photoURL } =
    messageObject;
  const { id: chatId, isGroup } = selectedChat;

  // Announces are messages like create a group and members joined
  if (type === "announce") {
    return (
      <div className="bg-primary-700 w-fit mx-auto p-2 leading-none text-xs rounded-lg my-2">
        {message.text}
      </div>
    );
  }

  const userColor = {
    "--color": uniqolor(uid + chatId, { lightness: 50 }).color,
  };
  // "uniqolor" generates the same color for the same value.
  // I choose to set the value as a combination of userId & chatId
  // With that I can generate different colors for the same user + I don't have to save it in the database

  const currentUserMsg = auth.currentUser.uid === uid;
  const isTheSameSender = prevMsgSender?.uid === uid;
  const groupDetail = isGroup && !currentUserMsg && !isTheSameSender;

  const dateFormater = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div
      className={`flex justify-start gap-2 ${
        currentUserMsg ? "flex-row-reverse" : ""
      } my-2`}
    >
      {isGroup && (
        <div className="w-8 h-8">
          {groupDetail && (
            <img
              src={photoURL}
              alt={`${displayName} avatar`}
              className={`w-full object-cover ${
                photoURL.includes("default-avatar") ? "bg-[var(--color)]" : ""
              } rounded-50 p-px`}
              style={userColor}
            />
          )}
        </div>
      )}
      <div
        className={`max-w-[70%] py-2 px-4 rounded-xl 
                        ${
                          currentUserMsg
                            ? "dark:bg-accent"
                            : "dark:bg-primary-800"
                        } dark:text-primary-200
                `}
      >
        {groupDetail && (
          <h3
            className={`font-medium text-[var(--color)] truncate`}
            style={userColor}
          >
            {displayName}
          </h3>
        )}
        <p>{message.text}</p>
        <time
          className={`block ${
            !currentUserMsg ? "text-right" : ""
          } text-[0.65rem] mt-2 opacity-60`}
        >
          {dateFormater.format(createdAt?.toDate()) ?? "--:--"}
        </time>
      </div>
    </div>
  );
};

Message.propTypes = {
  messageObject: PropTypes.shape({
    type: PropTypes.string,
    uid: PropTypes.string,
    message: PropTypes.shape({
      text: PropTypes.string,
      file: PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
      }),
    }).isRequired,
    createdAt: PropTypes.object,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  selectedChat: PropTypes.shape({
    id: PropTypes.string,
    isGroup: PropTypes.bool,
  }),
};

// memo() Prevents unnecessary re-render
export default memo(Message);
