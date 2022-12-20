import { memo } from "react"
import PropTypes from "prop-types"


const Chat = ({ 
  photoURL, 
  name, 
  lastMsgTime, 
  lastMsg, 
  unreadMsgs, 
  setSelectedChat, 
  selected
}) => {

    console.log("<Chat />")  
    return (
        <li 
          onClick={setSelectedChat}
          className={`grid grid-cols-[auto_1fr] text-sm rounded-xl gap-4 p-4 mb-2 last:mb-0 cursor-pointer transition-colors overflow-hidden select-none 
                      relative z-10 before:absolute before:inset-0 before:opacity-50 before:-z-10 before:transition-colors 
                      dark:active:before:bg-primary-700 dark:hover:before:bg-primary-800 ${selected ? "dark:bg-primary-800" : ""}`
          }
        >
          <img 
            src={photoURL} 
            alt="chat image" 
            className="w-14 h-14 object-cover rounded-50"
          />
          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-center gap-2 mb-2">
              <h3 className="text-base font-medium dark:text-primary-200 truncate">{name}</h3>
              <time className="whitespace-nowrap">{lastMsgTime}</time>
            </div>   
            <div className="flex justify-between items-center gap-2">
              <p className="truncate">{lastMsg}</p>
              {
                unreadMsgs > 0 &&
                <span className="bg-accent text-xs dark:text-primary-200 rounded-full py-[0.3rem] px-2 font-semibold leading-none">
                    {unreadMsgs}
                </span>
              }
            </div>
          </div>
        </li>
    )
}

Chat.proptypes = {
    chatImg: PropTypes.string, 
    chatName: PropTypes.string.isRequired, 
    lastMsgTime: PropTypes.string, 
    lastMsg: PropTypes.string, 
    unreadMsg: PropTypes.number,
    selected: PropTypes.bool
}

Chat.defaultProps = {
    chatImg: "", // placeholder image
    unreadMsg: 0,
    selected: false
}

export default memo(Chat)