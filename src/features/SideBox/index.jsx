import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion"

import Sidebar from "features/Sidebar";
import Profile from "features/Profile";
import ChatsList from "features/ChatsList";
import Users from "features/Users";
import Setting from "features/Setting";
import { fadeInLeft } from "util"

function SideBox() {
  const [tap, setTap] = useState("chats");

  function currentTap() {
    switch (tap) {
      case "profile":
        return <Profile />
      case "chats":
        return <ChatsList />
      case "contacts":
        return <Users />
      case "setting":
        return <Setting />
    }
  }

  return (
    <section className="basis-[30rem] shrink border-r border-primary-800 flex relative">
      <Sidebar tap={tap} setTap={setTap} />
      <AnimatePresence initial={false} mode="wait">
        <article className="py-6 px-4 flex-1">
          <motion.dev
            key={tap}
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="block"
          >
            {currentTap()}
          </motion.dev>
        </article>
      </AnimatePresence>
    </section>
  );
}

export default SideBox;
