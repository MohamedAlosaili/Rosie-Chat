import { memo, useContext } from "react";

import { signOut } from "firebase/auth";

import NvButton from "./NvButton";
import { UserContext } from "hooks/context"
import { auth } from "rosie-firebase";
import { IoMdChatbubbles, IoMdSettings } from "react-icons/Io"
import { HiUsers } from "react-icons/hi"
import { CiLogout } from "react-icons/ci"

function Sidebar({ tap, setTap }) {
  const userDoc = useContext(UserContext)

  return (
    <aside className="min-w-[60px] shrink-0 z-10">
      <nav className="h-screen dark:bg-primary-800 flex flex-col justify-between items-center py-6 px-4">
        <NvButton
          handleClick={() => setTap("profile")}
          tap={tap}
          img={userDoc.photoURL}
          btnTap="profile"
          userName={userDoc.displayName}
        />
        <div className="flex flex-col gap-4">
          <NvButton
            handleClick={() => setTap("chats")}
            tap={tap}
            icon={<IoMdChatbubbles size={25} />}
            btnTap="chats"
          />
          <NvButton
            handleClick={() => setTap("contacts")}
            tap={tap}
            icon={<HiUsers size={25} />}
            btnTap="contacts"
          />
          <NvButton
            handleClick={() => setTap("setting")}
            tap={tap}
            icon={<IoMdSettings size={25} />}
            btnTap="setting"
          />
        </div>
        <NvButton
          handleClick={() => signOut(auth)}
          tap={tap}
          icon={<CiLogout size={25} />}
          btnTap="logout"
        />
      </nav>
    </aside>
  );
}

export default memo(Sidebar);
