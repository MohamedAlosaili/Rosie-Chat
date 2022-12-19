import PropTypes from "prop-types"

import { auth } from "rosie-firebase"
import { defaultAvatar } from "imgs"

const Message = ({ uid, message, time, photoURL, isGroup }) => {

    const userMsg = auth.currentUser.uid === uid

    return (
        <div className={`flex justify-start gap-2 ${userMsg ? "flex-row-reverse" : ""} my-2`}>
            {isGroup && <img src={photoURL} alt="user message" className="w-8 h-8 object-cover" />}
            <div className={`max-w-[70%] py-2 px-4 rounded-xl dark:bg-${userMsg ? "accent" : "primary-800"} dark:text-primary-200`}>
              <p>{message}</p>
              <time className={`block text-${userMsg ? "left" : "right"} text-xs mt-2 text-primary-300`}>{time}</time>
            </div>
        </div>
    )
}

Message.propTypes = {
    uid: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    photoURL: PropTypes.string,
    isGroup: PropTypes.bool
}

Message.defaultProps = {
    photoURL: defaultAvatar,
    isGroup: false
}

export default Message