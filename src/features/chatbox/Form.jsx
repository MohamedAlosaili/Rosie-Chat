import { useState } from "react"
import PropTypes from "prop-types"
import { nanoid } from "nanoid"

import { collection, addDoc, serverTimestamp } from "firebase/firestore"

import { db, auth } from "rosie-firebase"
import { send } from "imgs"

function Form({ selectedChat }) {

    const [message, setMessage] = useState("")
    
    async function sendMessage(e) {
        e.preventDefault()
        console.log(message)

        const messagesRef = collection(db, `${selectedChat.isGroup ? "groups" : "direct"}/${selectedChat.id}/messages`)

        const { uid, photoURL } = auth.currentUser

        await addDoc(messagesRef, {
            id: nanoid(),
            uid,
            photoURL,
            message,
            createdAt: serverTimestamp()
        })
        setMessage("")
    }

    return (
        <form 
            onSubmit={sendMessage}
            className="flex items-center rounded-full border p-2 dark:bg-primary-900 dark:border-primary-700"
        >
            <input 
                type="text" 
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 text-primary-200 px-4 focus:outline-none bg-transparent"
            />
            <button className="w-10 aspect-square grid place-items-center rounded-50 bg-accent hover:bg-accent-600">
                <img src={send} className="invert" />
            </button>
        </form>
    )
}

Form.propTypes = {}

export default Form