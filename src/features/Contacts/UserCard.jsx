import { memo, useContext, useState } from "react";
import PropTypes from "prop-types";

import {
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { BsFillPersonPlusFill, BsFillChatFill } from "react-icons/bs";
import { FaUserMinus } from "react-icons/fa";

import { db } from "rosie-firebase";
import { Button, StatusMessage, Image } from "components";
import { ChatContext } from "hooks/context";
import { chatDocTemplate } from "util/objectsTemplate";

const UserCard = ({ user, isFriend, currentUser, updateDocument }) => {
  const { selectedChat, changeChat } = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  function addNewFriend() {
    updateDocument({
      friends: arrayUnion(user.uid),
    });
  }

  function removeFriend() {
    updateDocument({
      friends: arrayRemove(user.uid),
    });
  }

  async function startChatting() {
    setLoading(true);
    setError(undefined);
    const currentUserId = currentUser.uid;
    const otherUserId = user.uid;
    const chatId = [currentUserId, otherUserId].sort().join("");

    if (selectedChat.id === chatId) {
      setLoading(false);
      return;
    }

    try {
      const chatRef = doc(db, "chats", chatId);
      const chat = await getDoc(chatRef);

      if (chat.exists()) {
        changeChat(chat.data());
      } else {
        await setDoc(
          chatRef,
          chatDocTemplate({
            id: chatId,
            lastMsg: {
              uid: null,
              message: `Say hi to `,
              createdAt: serverTimestamp(),
            },
            [currentUserId]: {
              name: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [otherUserId]: {
              name: user.displayName,
              photoURL: user.photoURL,
            },
            members: [currentUserId, otherUserId],
          })
        );

        const chat = await getDoc(chatRef);
        changeChat(chat.data());
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl p-4 transition-colors dark:hover:bg-primary-800">
      {loading && <StatusMessage type="loading" message="Opening chat..." />}
      {error && <StatusMessage type="error" message={error} />}
      <Image
        img={{ url: user.photoURL, name: user.displayName }}
        className="aspect-square w-14 rounded-full"
      />
      <div className="w-full overflow-hidden">
        <h3 className="truncate font-semibold dark:text-primary-200">
          {user.displayName}
        </h3>
        {user.about && <p className="truncate">{user.about}</p>}
      </div>
      {isFriend ? (
        <div className="flex gap-2">
          <Button
            title="Start chatting"
            handleClick={startChatting}
            disabled={loading}
          >
            <BsFillChatFill size={18} />
          </Button>
          <Button
            title="Remove from friends"
            handleClick={removeFriend}
            bg="red"
            disabled={loading}
          >
            <FaUserMinus size={18} />
          </Button>
        </div>
      ) : (
        <Button
          title="Add to friends"
          handleClick={addNewFriend}
          disabled={loading}
        >
          <BsFillPersonPlusFill size={18} />
        </Button>
      )}
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    photoURL: PropTypes.string,
    displayName: PropTypes.string,
    about: PropTypes.string,
  }),
  isFriend: PropTypes.bool,
  currentUser: PropTypes.object,
  updateDocument: PropTypes.func,
};

export default memo(UserCard);
