import { useState } from "react"

import { signOut } from "firebase/auth"

import { auth } from "rosie-firebase"
import { chat, contacts, setting, logout } from "imgs"
import NvButton from "./NvButton" 

function Sidebar() {
  const [tap, setTap] = useState("chats")

  return (
    
      <nav className="min-w-[60px] shrink-0 dark:bg-primary-800 flex flex-col justify-between items-center py-6 px-4">
          <NvButton 
            handleClick={() => setTap("profile")} 
            tap={tap} 
            img={auth.currentUser.photoURL} 
            btnTap="profile"
            userName={auth.currentUser.displayName}
          />
        <div className="flex flex-col gap-4">
          <NvButton 
            handleClick={() => setTap("chats")} 
            tap={tap} 
            img={chat} 
            btnTap="chats"
          />
          <NvButton 
            handleClick={() => setTap("contacts")} 
            tap={tap} 
            img={contacts} 
            btnTap="contacts"
          />
          <NvButton 
            handleClick={() => setTap("setting")} 
            tap={tap} 
            img={setting} 
            btnTap="setting"
          />
        </div>
      <NvButton 
        handleClick={() => signOut(auth)} 
        tap={tap} 
        img={logout} 
        btnTap="logout"
        />
    </nav>
  )
}

export default Sidebar