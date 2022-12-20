import { useState } from "react"

import { Sidebar } from "features/sidebar"
import { ChatList } from "features/chats"

function SideBox(props) {
    const [tap, setTap] = useState("chats")

    return (
        <section className="basis-[30rem] shrink border-r border-primary-800 flex">
           <Sidebar tap={tap} setTap={setTap} />
           <article className="py-6 px-4 flex-1">
            <ChatList {...props} />
           </article> 
        </section>
    )
}

export default SideBox 