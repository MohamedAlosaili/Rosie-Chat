import { useState } from "react"
import PropTypes from "prop-types"
import { nanoid } from "nanoid"

import { collection, addDoc, serverTimestamp } from "firebase/firestore"

import { db, auth } from "rosie-firebase"
import { send } from "imgs"

function Form({ selectedChat, bottomChat }) {

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    function sendMessage(e) {
        e.preventDefault()

        if(message !== "") {
            setLoading(true)

            const messagesRef = collection(db, `${selectedChat.isGroup ? "groups" : "direct"}/${selectedChat.id}/messages`)

            // Removing 'semicolon' causes this error 'Uncaught TypeError: auth.currentUser is not a function'
            const { uid, photoURL } = auth.currentUser; 

            (async function() {
                try {
                    await addDoc(messagesRef, {
                        id: nanoid(),
                        uid,
                        photoURL,
                        message,
                        createdAt: serverTimestamp()
                    })
                    setMessage("")
                    setLoading(false)
                    bottomChat.current.scrollIntoView({ behavior: "smooth" })
                } catch(e) {
                    console.log(e)
                }
            })()
        }
    }
    console.log("message", message)
    return (
        <form 
            onSubmit={sendMessage}
            className="flex items-center rounded-full border p-2 dark:bg-primary-900 dark:border-primary-700"
        >
            <input 
                type="text" 
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value.trimStart())}
                className="flex-1 text-primary-200 px-4 focus:outline-none bg-transparent"
            />
            <button
                disabled={message === "" || loading}
                className={`w-10 aspect-square grid place-items-center rounded-50 bg-accent 
                            ${message !== "" && !loading ? "hover:bg-accent-600 active:scale-[0.98]" : ""}`
                }
            >
                <img src={send} className="invert" />
            </button>
        </form>
    )
}

Form.propTypes = {}

export default Form