import { send } from "imgs"

function ChatBox() {
  return (
    <div className="basis-[30rem] grow shrink flex flex-col bg-[url('/src/imgs/conversation/chat-bg.png')] bg-contain">
      <header className="flex items-center gap-4 p-4 pt-6 border-b border-primary-800 dark:bg-primary-900">
        <img 
          src="https://lh3.googleusercontent.com/a/AEdFTp4ump6-jkdHxj4z110nZxqaZ-TVTN-2TdlVU3919w=s96-c" 
          alt={`user photo`} 
          className="h-10 aspect-square object-cover rounded-50"
        />
        <h3 className="font-medium dark:text-primary-200">Mohamed</h3>
      </header>
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar">
        <div className="max-w-2xl mx-auto">
          
        </div>
      </main>
      <footer className="w-full max-w-2xl mx-auto py-2 border-t dark:border-primary-800">
        <form 
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center rounded-full border dark:bg-primary-900 dark:border-primary-700"
        >
          <input 
            type="text" 
            placeholder="Type a message"
            className="flex-1 text-primary-200 py-4 px-6 focus:outline-none bg-transparent"
          />
          <button className="w-13 p-2 mr-2 rounded-50 aspect-square bg-accent hover:bg-accent-600">
            <img src={send} className="invert" />
          </button>
        </form>
      </footer>
    </div>
  )
}

export default ChatBox
