import { useContext, useEffect, useState } from "react";

import { FiSun } from "react-icons/fi";
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { RiComputerLine } from "react-icons/ri";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "firebase/auth";

import useStorage from "hooks/useStorage";
import { UserContext } from "context/UserContext";
import { auth } from "rosie-firebase";

function Setting() {
  const { updateDocument } = useContext(UserContext);

  const [getStorageTheme, setStorageTheme, removeStorageTheme] = useStorage(
    "localStorage",
    "theme"
  );
  const [theme, setTheme] = useState(userPreferredTheme());
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  function userPreferredTheme(useUserSystem) {
    if (getStorageTheme && !useUserSystem) return getStorageTheme;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    } else return "dark";
  }

  function changeTheme(newTheme) {
    if (newTheme === "system") {
      removeStorageTheme();
      setTheme(userPreferredTheme(true));
      return;
    }
    setStorageTheme(newTheme);
    setTheme(newTheme);
  }

  async function handleSignOut() {
    await updateDocument({ isOnline: false });
    signOut(auth);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative dark:text-primary-200"
        onMouseLeave={() => setShowThemeMenu(false)}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => null} // setShowThemeMenu(true)
          className="flex w-full cursor-pointer items-center justify-between rounded-xl py-2 px-4 font-semibold transition-colors dark:hover:bg-primary-800/50"
        >
          Theme
          <span className="flex items-center gap-2 text-xs dark:text-primary-400">
            <BsFillExclamationCircleFill />
            Theme feature not ready yet
          </span>
          {theme === "dark" ? (
            <MdOutlineDarkMode size={20} className="text-info-400" />
          ) : (
            <FiSun size={20} className="text-yellow-500" />
          )}
        </motion.div>
        <AnimatePresence>
          {showThemeMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "tween" }}
              className="absolute top-2 right-2 z-10 w-44 overflow-hidden rounded-xl text-sm dark:bg-primary-800"
            >
              <button
                onClick={() => changeTheme("dark")}
                className={`flex w-full items-center p-2 font-semibold transition-colors dark:hover:bg-primary-700/75 ${
                  getStorageTheme === "dark" ? "text-accent" : ""
                }`}
              >
                <MdOutlineDarkMode size={20} className="w-8" /> Dark
              </button>
              <button
                onClick={() => changeTheme("light")}
                className={`flex w-full items-center p-2 font-semibold transition-colors dark:hover:bg-primary-700/75 ${
                  getStorageTheme === "light" ? "text-accent" : ""
                }`}
              >
                <FiSun size={20} className="w-8" /> Light
              </button>
              <button
                onClick={() => changeTheme("system")}
                className={`flex w-full items-center p-2 font-semibold transition-colors dark:hover:bg-primary-700/75 ${
                  !getStorageTheme ? "text-accent" : ""
                }`}
              >
                <RiComputerLine size={20} className="w-8" />
                System
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSignOut}
        className="flex w-full items-center justify-between rounded-xl py-2 px-4 font-semibold text-red-600 transition-colors hover:bg-red-600/10"
      >
        Logout <CiLogout size={20} className="stroke-1" />
      </motion.button>
    </div>
  );
}

export default Setting;
