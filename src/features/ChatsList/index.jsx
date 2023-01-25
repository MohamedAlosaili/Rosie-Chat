import { useContext } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore"
import { collection, orderBy, query, where } from "firebase/firestore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsExclamationCircleFill } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";

import { db } from "rosie-firebase"
import Chat from "./Chat";
import { UserContext, ChatContext } from "hooks/context";
import { search } from "imgs";

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

  const userChats = chats?.map((chat) => (
    <Chat key={chat.id} chat={chat} isSelected={chat.id === selectedChat.id} />
  ));

  return (
    <section className="flex flex-col gap-4">
      <h1 className="dark:text-primary-200 text-2xl font-semibold">Chats</h1>
      <form className="relative">
        <input
          type="search"
          placeholder="Search..."
          className={`peer w-full focus:outline-none rounded-full px-4 pr-10 py-2 text-sm dark:bg-primary-800 dark:text-primary-200 transition-colors focus:placeholder:transition-colors
                      dark:focus:placeholder:text-primary-200 border-2 dark:border-primary-700 dark:focus:border-accent `}
        />
        <BiSearchAlt
          size={20}
          className={`transition-colors absolute right-4 top-1/2 -translate-y-1/2 
          dark:peer-focus:text-primary-200`
          }
        />
      </form>
      {/* TODO: Status need improvements */}
      {userChatsLoading && (
        <div className="flex items-center gap-2 justify-center mt-4 dark:text-primary-200">
          <BsExclamationCircleFill size={20} className="animate-spin" />
          Loading chats...
        </div>
      )}
      {userChatsError && (
        <div className="flex items-center gap-2 justify-center mt-4 dark:text-primary-200">
          <AiOutlineLoading3Quarters size={20} />
          {userChatsError.code}
        </div>
      )}
      {userChats && <ul>{userChats}</ul>}
    </section>
  );
}

export default ChatsList;
