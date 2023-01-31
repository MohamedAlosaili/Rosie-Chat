import { memo, useContext } from "react"
import PropTypes from "prop-types"

import { collection, doc, getDoc, addDoc, arrayUnion, arrayRemove, serverTimestamp, updateDoc, setDoc } from "firebase/firestore"
import { BsFillPersonPlusFill, BsFillChatFill } from "react-icons/bs"
import { FaUserMinus } from "react-icons/fa"
import { nanoid } from "nanoid"

import { db } from "rosie-firebase"
import { Button } from "components"
import { ChatContext } from "hooks/context"
import { chatDocTemplate } from "util/objectsTemplate"

const UserCard = ({ user, isFriend, currentUser, updateDocument }) => {

    const { changeChat } = useContext(ChatContext)

    function addNewFriend() {
        updateDocument({
            friends: arrayUnion(user.uid)
        })
    }

    function removeFriend() {

        updateDocument({
            friends: arrayRemove(user.uid)
        })
    }

    async function startChatting() {
        const currentUserId = currentUser.uid
        const otherUserId = user.uid
        const chatId = [currentUserId, otherUserId].sort().join("")
        console.log(chatId)
        const chatRef = doc(db, "chats", chatId)
        const chat = await getDoc(chatRef)

        if (chat.exists()) {
            changeChat(chat.data())
        } else {
            // TODO: endOne & endTwo have to change into clear names
            await setDoc(chatRef, chatDocTemplate({
                id: chatId,
                endOne: {
                    uid: currentUserId,
                    name: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                },
                endTwo: {
                    uid: otherUserId,
                    name: user.displayName,
                    photoURL: user.photoURL,
                },
                lastMsg: {
                    uid: null,
                    message: `Say hi to `,
                    createdAt: serverTimestamp(),
                },
                members: [currentUserId, otherUserId],
            }))

            await updateDocument({ chats: arrayUnion(chatId) })
            await updateDoc(doc(db, "users", otherUserId), { chats: arrayUnion(chatId) })

            const chat = await getDoc(chatRef)
            changeChat(chat.data())
        }
    }

    return (
        <div
            className="transition-colors grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 rounded-xl dark:hover:bg-primary-800"
        >
            <img src={user.photoURL} alt={`${user.displayName} photo`} className="w-14 rounded-full" />
            <div className="w-full overflow-hidden">
                <h3 className="dark:text-primary-200 font-semibold truncate">{user.displayName}</h3>
                {user.about && <p className="truncate">{user.about}</p>}
            </div>
            {isFriend
                ? (
                    <div className="flex gap-2">
                        <Button title="Start chatting" handleClick={startChatting}>
                            <BsFillChatFill size={18} />
                        </Button>
                        <Button title="Remove from friends" handleClick={removeFriend}>
                            <FaUserMinus size={18} className="text-red-800" />
                        </Button>
                    </div>
                ) : (
                    <Button title="Add to friends" handleClick={addNewFriend}>
                        <BsFillPersonPlusFill size={18} />
                    </Button>
                )
            }
        </div>
    )
}

UserCard.propTypes = {
    user: PropTypes.shape({
        photoURL: PropTypes.string,
        displayName: PropTypes.string,
        about: PropTypes.string
    }),
    isFriend: PropTypes.bool,
    currentUser: PropTypes.object,
    updateDocument: PropTypes.func
}

export default memo(UserCard)