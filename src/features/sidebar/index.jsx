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

  const windowWidth = window.innerWidth
  console.log(windowWidth)
  return (
    <aside
      className={`absolute lg:static bottom-0 left-0 w-full z-10 dark:bg-primary-800 lg:w-auto lg:min-w-[60px] lg:shrink-0`}
    >
      <nav className="flex justify-between items-center max-w-md mx-auto px-4 py-2 lg:py-6 lg:flex-col lg:h-screen">
        <NvButton
          handleClick={() => setTap("profile")}
          tap={tap}
          img={userDoc.photoURL}
          btnTap="profile"
          userName={userDoc.displayName}
        />
        <div className="flex gap-4 justify-between w-[70%] lg:w-auto lg:flex-col">
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
        {windowWidth >= 1024 && (
          <div className="hidden lg:block">
            <NvButton
              handleClick={() => signOut(auth)}
              tap={tap}
              icon={<CiLogout size={25} />}
              btnTap="logout"
            />
          </div>
        )}
      </nav>
    </aside>
  );
}

export default memo(Sidebar);
