import PropTypes from "prop-types"

import { auth } from "rosie-firebase"
import { defaultAvatar } from "imgs"

const Message = ({ 
    type, 
    uid, 
    message, 
    createdAt, 
    displayName, 
    photoURL, 
    isGroup,
    memberColor 
}) => {

    if(type === "announce") {
        return (
            <div className="bg-primary-700 w-fit mx-auto p-2 leading-none text-xs rounded-lg my-2">
                {message}
            </div>
        )
    }
    // Convert firebase timestamp into readable time
    let messageTime
    if(createdAt) {
        const date = `${createdAt.toDate()}`
        const extractedTime = date.match(/\d\d:\d\d/g)[0].split(":")
        
        const period = +extractedTime[0] >= "12" ? "PM" : "AM"
        const minutes = extractedTime[1]
        const hours = extractedTime[0] % 12 || 12

        messageTime = `${hours}:${minutes} ${period}`
    } else { console.log("error", type, uid, message, createdAt, photoURL, isGroup) }

    const currentUserMsg = auth.currentUser.uid === uid

    return (
        <div className={`flex justify-start gap-2 ${currentUserMsg ? "flex-row-reverse" : ""} my-2`}>
            {isGroup && <img src={photoURL} alt="user message" className="w-8 h-8 object-cover" />}
            <div 
                className={`max-w-[70%] py-2 px-4 rounded-xl 
                        ${currentUserMsg ? "dark:bg-accent" : "dark:bg-primary-800"} dark:text-primary-200
                `}
            >
              {isGroup && !currentUserMsg && <h3 className={`font-medium text-[${memberColor}] truncate`}>{displayName}</h3>}  
              <p>{message}</p>
              <time className={`block ${!currentUserMsg ? "text-right" : ""} text-[0.65rem] mt-2 opacity-60`}>
                {messageTime ?? "--:--"}
              </time>
            </div>
        </div>
    )
}

Message.propTypes = {
    uid: PropTypes.string,
    message: PropTypes.string.isRequired,
    time: PropTypes.string,
    photoURL: PropTypes.string,
    isGroup: PropTypes.bool
}

Message.defaultProps = {
    photoURL: defaultAvatar,
    isGroup: false
}

export default Message