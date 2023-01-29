import { useContext } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore"
import { collection, orderBy, query, where } from "firebase/firestore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsExclamationCircleFill } from "react-icons/bs";


import Chat from "./Chat";
import { db } from "rosie-firebase"
import { UserContext, ChatContext } from "hooks/context";
import { SearchForm } from "components";
import { useSearch } from "hooks";

function ChatsList() {
  // TODO: userDoc sometimes return null
  const userDoc = useContext(UserContext);
  const { selectedChat } = useContext(ChatContext);

  const qu = query(
    collection(db, "chats"),
    where("id", "in", userDoc.chats),
    orderBy("lastMsg.createdAt")
  )
  const [chats, userChatsLoading, userChatsError] = useCollectionData(qu)
  const [searchValue, setSearchValue, searchResults] = useSearch("chats", chats, "name")

  const chatsElements = (searchValue ? searchResults : chats)?.map((chat) => (
    <Chat key={chat.id} chat={chat} isSelected={chat.id === selectedChat.id} />
  ));

  return (
    <div className="flex flex-col gap-4">
      <SearchForm
        value={searchValue}
        setValue={setSearchValue}
        disabled={userChatsLoading}
      />
      {userChatsLoading && (
        <div className="flex items-center gap-2 justify-center mt-4 dark:text-primary-200">
          <AiOutlineLoading3Quarters size={20} className="animate-spin" />
          Loading chats...
        </div>
      )}
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
