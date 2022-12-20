import { useState, useEffect } from "react";

import { useDocumentData } from "react-firebase-hooks/firestore" 
import { collection, setDoc, getDoc, doc } from "firebase/firestore"

import { db } from "rosie-firebase"
import { SideBox } from "features/sidebox"
import { ChatBox } from "features/chatbox"
import { StatusMessage } from "../components";

export default function Home({ user }) {


  const [userDoc, loading, error] = useDocumentData(doc(db, "users", user.uid))
  const [selectedChatId, setSelectedChatId] = useState("")

  useEffect(() => {
    (async function() {
        if(!userDoc) {
          try {
            const { displayName, email, photoURL, uid } = user
            const publicChat = (await getDoc(doc(db, "groups", "public_chat"))).data()
            const usersRef = collection(db, "users")

            await setDoc(doc(usersRef, uid), {
              displayName, 
              email,
              photoURL,
              chats: [publicChat]
            })
          } catch(e) {
            console.log(e)
          }
        }
      })()
  }, [userDoc])

  if(loading) {
    return <StatusMessage message="Loading..." type="loading" />
  }

  if(error) {
    return <StatusMessage type="error" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden flex">
      <SideBox 
        chats={userDoc.chats} 
        selectedChatId={selectedChatId} 
        setSelectedChatId={setSelectedChatId} 
      />
      <ChatBox selectedChatId={selectedChatId} />
    </div>
  );
}
