import { useEffect, useRef } from "react"
import PropTypes from "prop-types"

import { collection, query, orderBy } from "firebase/firestore"
import { useCollectionData } from "react-firebase-hooks/firestore"

import { db } from "rosie-firebase"
import { defaultAvatar } from "imgs" 
import Message from "./Message"
import Form from "./Form"
import { StatusMessage } from "../../components"

function Conversation({ selectedChat }) {

    const q = query(
        collection(db, `${selectedChat.isGroup ? "groups" : "direct"}/${selectedChat.id}/messages`), 
        orderBy("createdAt")
    )

    const [messages, isMessagesLoading, messagesError] = useCollectionData(q)    
    const bottomChat = useRef()

    return (
        <div className="h-full flex flex-col bg-[url('/src/imgs/chat/chat-bg.png')] bg-contain">
            { messagesError && <StatusMessage message={messagesError?.code} type="error" /> }
            <header className="flex items-center gap-4 p-4 pt-6 border-b border-primary-800 dark:bg-primary-900">
                <img 
                    src={selectedChat.photoURL} 
                    alt={`${selectedChat.name} photo`} 
                    className="h-10 aspect-square object-cover rounded-50"
                    onError={(e) => e.target.src = defaultAvatar}
                />
                <h3 className="font-medium dark:text-primary-200">{ selectedChat.name }</h3>
            </header>
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar relative">
                {isMessagesLoading && <StatusMessage message="Loading..." type="loading" position="absolute" /> }
                <div className="max-w-2xl mx-auto">
                    {
                        messages?.map(msg => (
                            <Message key={msg.id} {...msg} isGroup={selectedChat.isGroup} />
                        ))
                    }
                    <div ref={bottomChat}></div>
                </div>
            </main>
            <footer className="w-full max-w-2xl mx-auto p-2 py-3 border-t dark:border-primary-800">
                <Form selectedChat={selectedChat} bottomChat={bottomChat} />
            </footer>
        </div>
    )
}

Conversation.propTypes = {}

export default Conversation