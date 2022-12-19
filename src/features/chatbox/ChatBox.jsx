import Conversation from "./Conversation"
import { selectChat } from "imgs"

function ChatBox({ chatId }) {
  return (
    <div className="basis-[30rem] grow shrink">
      {
        chatId 
        ? (
          <Conversation chatId={chatId} />
        ) 
        : (
          <div className="h-full flex flex-col justify-center items-center">
            <img 
              src={selectChat} 
              alt="empty chat" 
              className="w-full max-w-lg"
            />
            <h3 className="text-lg font-medium mt-8 text-primary-300">Select a chat to start messaging</h3>
          </div>
        )
      }
    </div>
  )
}

export default ChatBox
