import { lazy, Suspense, useContext, useState } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, orderBy, query, where } from "firebase/firestore";
import { BsExclamationCircleFill, BsFillPersonFill } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";
import { HiUserGroup } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";

import useSearch from "hooks/useSearch";
import Chat from "./Chat";
import SearchForm from "components/SearchForm";
import Tooltip from "components/Tooltip";
import SkeletonLoader from "components/SkeletonLoader";
import { db } from "rosie-firebase";
import { UserContext } from "context/UserContext";
import { ChatContext } from "context/ChatContext";

const NewGroupModal = lazy(() => import("./NewGroupModal"));

function ChatsList({ setTap }) {
  const { currentUser } = useContext(UserContext);
  const { selectedChat } = useContext(ChatContext);

  const [showNewChatsMenu, setShowNewChatsMenu] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  const chatsQuery = query(
    collection(db, "chats"),
    where("members", "array-contains", currentUser.uid),
    orderBy("lastMsg.createdAt", "desc")
  );
  const [chats, userChatsLoading, userChatsError] =
    useCollectionData(chatsQuery);
  // TODO: Not work well because the the info of the chat is different from private and group chats
  const [searchValue, setSearchValue, searchResults] = useSearch(
    chats,
    "chats",
    currentUser.uid
  );

  const chatsElements = (searchValue ? searchResults : chats)?.map((chat) => (
    <Chat
      key={chat.id}
      chat={chat}
      currentUserId={currentUser.uid}
      isSelected={chat.id === selectedChat.id}
    />
  ));

  const userChatsReady = !userChatsLoading && !userChatsError;

  return (
    <div className="flex h-full flex-col gap-4">
      <div
        className="absolute top-0 right-0 z-50 translate-y-2 cursor-pointer dark:text-primary-200"
        onMouseLeave={() => showNewChatsMenu && setShowNewChatsMenu(false)}
      >
        <TbEdit
          size={25}
          className="peer"
          onClick={() => setShowNewChatsMenu(true)}
        />
        <Tooltip text="New chat" position="left" />
        <AnimatePresence>
          {showNewChatsMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "tween" }}
              className="absolute top-2 right-2 z-10 flex w-max w-56 flex-col overflow-hidden rounded-xl text-sm dark:bg-primary-800"
            >
              <button
                onClick={() => setTap("friends")}
                className="flex items-center gap-2 p-4 transition-colors dark:hover:bg-primary-700/75"
              >
                <BsFillPersonFill size={20} /> New chat
              </button>
              <button
                onClick={() => setShowNewGroupModal(true)}
                className="flex items-center gap-2 p-4 transition-colors dark:hover:bg-primary-700/75"
              >
                <HiUserGroup size={20} /> New group
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showNewGroupModal && (
          <Suspense fallback={<div></div>}>
            <NewGroupModal
              setTap={setTap}
              setShowNewGroupModal={setShowNewGroupModal}
              currentUserId={currentUser.uid}
              currentUserFriends={currentUser.friends}
            />
          </Suspense>
        )}
      </AnimatePresence>
      <SearchForm
        value={searchValue}
        setValue={setSearchValue}
        disabled={userChatsLoading}
      />
      {userChatsLoading && <SkeletonLoader.Cards />}
      {userChatsError && (
        <div className="mt-4 flex items-center justify-center gap-2 dark:text-primary-200">
          <BsExclamationCircleFill size={20} className="text-red-800" />
          {userChatsError?.code ?? (
            <span className="text-sm">
              Something went wrong while loading chats <br /> Please try again
              in a minute
            </span>
          )}
        </div>
      )}
      {userChatsReady &&
        (chatsElements?.length > 0 ? (
          <ul className="no-scrollbar overflow-y-auto overflow-x-hidden pb-20 lg:pb-0">
            {chatsElements}
          </ul>
        ) : (
          searchValue !== "" && (
            <div className="break-all text-center dark:text-primary-200">
              <p>
                Results for:{" "}
                <span className="italic dark:text-primary-400">
                  {searchValue}
                </span>
              </p>
              <p>No chats found.</p>
            </div>
          )
        ))}
    </div>
  );
}

export default ChatsList;
