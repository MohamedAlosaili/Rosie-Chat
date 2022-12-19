import PropTypes from "prop-types"

import { defaultAvatar } from "imgs" 
import Message from "./Message"
import Form from "./Form"

function Conversation() {
    return (
        <div className="h-full flex flex-col bg-[url('/src/imgs/conversation/chat-bg.png')] bg-contain">
            <header className="flex items-center gap-4 p-4 pt-6 border-b border-primary-800 dark:bg-primary-900">
                <img 
                    src="https://lh3.googleusercontent.com/a/AEdFTp4ump6-jkdHxj4z110nZxqaZ-TVTN-2TdlVU3919w=s96-c" 
                    alt={`user photo`} 
                    className="h-10 aspect-square object-cover rounded-50"
                    onError={(e) => e.target.src = defaultAvatar}
                />
                <h3 className="font-medium dark:text-primary-200">Mohamed</h3>
            </header>
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar">
                <div className="max-w-2xl mx-auto">
                    
                </div>
            </main>
            <footer className="w-full max-w-2xl mx-auto p-2 py-3 border-t dark:border-primary-800">
                <Form />
            </footer>
        </div>
    )
}

Conversation.propTypes = {}

export default Conversation