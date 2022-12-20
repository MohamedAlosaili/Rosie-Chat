import { useState, useEffect } from "react";

import { useDocumentData } from "react-firebase-hooks/firestore" 
import { collection, setDoc, getDoc, doc, addDoc, serverTimestamp } from "firebase/firestore"

import { db } from "rosie-firebase"
import { SideBox } from "features/sidebox"
import { ChatBox } from "features/chatbox"
import { StatusMessage } from "../components";

export default function Home({ user }) {


  const [userDoc, loading, error] = useDocumentData(doc(db, "users", user.uid))
  const [selectedChat, setSelectedChat] = useState({
    id: "",
    isGroup: "" 
  })

  useEffect(() => {
      if(!userDoc && !loading) {
        (async function() {
          try {
            const { displayName, email, photoURL, uid } = user

            const publicChat = (await getDoc(doc(db, "groups", "public_chat"))).data()
            const publicChatMessages = collection(db, "groups/public_chat/messages")
            const usersRef = collection(db, "users")

            await setDoc(doc(usersRef, uid), {
              displayName, 
              email,
              photoURL,
              chats: [publicChat]
            })
            // Alert if user has been added
            await addDoc(publicChatMessages, { 
              type: "announce", 
              message: `${displayName} joined`,
              createdAt: serverTimestamp()
            })
          } catch(e) {
            console.log(e)
          }
        })()
      }
      }, [userDoc, loading])

  if(loading) {
    return <StatusMessage message="Loading..." type="loading" />
  }

  if(error) {
    return <StatusMessage type="error" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden flex">
      {
        userDoc &&
        (
          <>
            <SideBox 
              chats={userDoc.chats} 
              selectedChat={selectedChat} 
              setSelectedChat={setSelectedChat} 
            />
            <ChatBox selectedChat={selectedChat} />
          </>
        )
      }
    </div>
  );
}
