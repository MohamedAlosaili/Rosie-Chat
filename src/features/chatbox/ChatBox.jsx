import Conversation from "./Conversation"

function ChatBox({ chatId }) {
  return (
    <div className="basis-[30rem] grow shrink">
      {
        chatId 
        ? <Conversation /> 
        : <h1>Select chat to start messaging</h1>
      }
    </div>
  )
}

export default ChatBox
