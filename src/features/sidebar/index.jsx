import { memo, useContext } from "react";

import { signOut } from "firebase/auth";

import NvButton from "./NvButton";
import { UserContext } from "hooks/context";
import { auth } from "rosie-firebase";
import { IoMdChatbubbles, IoMdSettings } from "react-icons/Io";
import { HiUsers } from "react-icons/hi";
import { CiLogout } from "react-icons/ci";

function Sidebar({ tap, setTap }) {
  const { currentUser } = useContext(UserContext);

  const windowWidth = window.innerWidth;

  return (
    <aside
      className={`absolute bottom-0 left-0 z-10 w-full dark:bg-primary-800 lg:static lg:w-auto lg:min-w-[60px] lg:shrink-0`}
    >
      <nav className="mx-auto flex max-w-md items-center justify-between px-4 py-2 lg:h-screen lg:flex-col lg:py-6">
        <NvButton
          handleClick={() => setTap("profile")}
          tap={tap}
          img={currentUser.photoURL}
          btnTap="profile"
          userName={currentUser.displayName}
        />
        <div className="flex w-[70%] justify-between gap-4 lg:w-auto lg:flex-col">
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
