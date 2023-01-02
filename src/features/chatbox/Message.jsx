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

    const currentUserMsg = auth.currentUser.uid === uid 
    const dateFormater = new Intl.DateTimeFormat("en-US", {hour: 'numeric', minute: 'numeric'})

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
                {dateFormater.format(createdAt?.toDate()) ?? "--:--"}
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