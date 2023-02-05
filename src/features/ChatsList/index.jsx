import { useContext } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore"
import { collection, orderBy, query, where } from "firebase/firestore";
import { BsExclamationCircleFill } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";

import Chat from "./Chat";
import { db } from "rosie-firebase"
import { UserContext, ChatContext } from "hooks/context";
import { SearchForm, Tooltip, SkeletonLoader } from "components";
import { useSearch } from "hooks";

function ChatsList() {
  // TODO: userDoc sometimes return null
  const { currentUser } = useContext(UserContext);
  const { selectedChat } = useContext(ChatContext);

  const chatsQuery = query(
    collection(db, "chats"),
    where("members", "array-contains", currentUser.uid),
    orderBy("lastMsg.createdAt", "desc")
  )
  const [chats, userChatsLoading, userChatsError] = useCollectionData(chatsQuery)
  const [searchValue, setSearchValue, searchResults] = useSearch("chats", chats, "name")

  const chatsElements = (searchValue ? searchResults : chats)?.map((chat) => (
    <Chat key={chat.id} chat={chat} isSelected={chat.id === selectedChat.id} />
  ));  

  const skeletonLoaders = Array(0, 1, 2, 3, 4).map(item => (
    <SkeletonLoader.Card key={item} isChat={true} />
  ))
  console.log(skeletonLoaders)
  return (
    <div className="flex flex-col gap-4">
      <button className="absolute top-0 right-0 translate-y-2">
        <TbEdit size={25} className="dark:text-primary-200 peer" />
        <Tooltip text="New chat" position="right" />
      </button>
      <SearchForm
        value={searchValue}
        setValue={setSearchValue}
        disabled={userChatsLoading}
      />
      {userChatsLoading && skeletonLoaders}
      {userChatsError && (
        <div className="flex items-center gap-2 justify-center mt-4 dark:text-primary-200">
          <BsExclamationCircleFill size={20} className="text-red-800" />
          {userChatsError?.code ?? <span className="text-sm">Something went wrong while loading chats <br /> Please try again in a minute</span>}

        </div>
      )}
      {(!userChatsLoading && !userChatsError && (
        chatsElements?.length > 0
          ? <ul>{chatsElements}</ul>
          : (
            <div className="text-center dark:text-primary-200 break-all">
              <p>Results for: <span className="italic dark:text-primary-400">{searchValue}</span></p>
              <p>No chats found.</p>
            </div>
          )
      ))}
    </div>
  );
}

export default ChatsList;
