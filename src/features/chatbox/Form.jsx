import { useState } from "react"
import PropTypes from "prop-types"
import { nanoid } from "nanoid"

import { collection, addDoc, serverTimestamp } from "firebase/firestore"

import { db, auth } from "rosie-firebase"
import { send } from "imgs"

function Form({ selectedChat, bottomChat }) {

    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)

    function sendMessage(e) {
        e.preventDefault()

        if(message !== "") {
            setSending(true)

            const messagesRef = collection(db, `${selectedChat.isGroup ? "groups" : "direct"}/${selectedChat.id}/messages`)

            // Removing 'semicolon' causes this error 'Uncaught TypeError: auth.currentUser is not a function'
            const { uid, photoURL, displayName } = auth.currentUser; 

            (async function() {
                try {
                    // setState handled asynchronously
                    setMessage("")
                    setSending(false)

                    await addDoc(messagesRef, {
                        id: nanoid(),
                        uid,
                        displayName,
                        photoURL,
                        message: message.trim(),
                        createdAt: serverTimestamp()
                    })

                    bottomChat.current.scrollIntoView({ behavior: "smooth" })
                } catch(e) {
                    console.log(e)
                }
            })()
        }
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
            <button
                disabled={message.trim() === "" || sending}
                className={`w-10 aspect-square grid place-items-center rounded-50 bg-accent 
                            ${message.trim() !== "" && !sending ? "hover:bg-accent-600 active:scale-[0.98]" : ""}`
                }
            >
                <img src={send} className="invert" />
            </button>
        </form>
    )
}

Form.propTypes = {}

export default Form