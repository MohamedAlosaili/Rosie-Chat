import { memo, useContext } from "react";

import { signOut } from "firebase/auth";
import { IoMdChatbubbles, IoMdSettings } from "react-icons/Io";
import { HiUsers } from "react-icons/hi";
import { CiLogout } from "react-icons/ci";

import NvButton from "./NvButton";
import { UserContext } from "context/UserContext";
import { auth } from "rosie-firebase";

function Sidebar({ tap, setTap }) {
  const { currentUser, updateDocument } = useContext(UserContext);

  const windowWidth = window.innerWidth;

  async function handleSignOut() {
    await updateDocument({ isOnline: false });
    signOut(auth);
  }

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
              handleClick={handleSignOut}
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
