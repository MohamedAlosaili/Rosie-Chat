import { useState, lazy, Suspense } from "react";

import { AnimatePresence, motion } from "framer-motion";

import Sidebar from "features/Sidebar";
import ErrorBoundary from "pages/ErrorBoundary";
import { fadeInLeft } from "util/motionVariants";

const Profile = lazy(() => import("features/Profile"));
const ChatsList = lazy(() => import("features/ChatsList"));
const Contacts = lazy(() => import("features/Contacts"));
const Setting = lazy(() => import("features/Setting"));

function SideBox() {
  const [tap, setTap] = useState("chats");

  function currentTap() {
    switch (tap) {
      case "profile":
        return <Profile />;
      case "chats":
        return <ChatsList setTap={setTap} />;
      case "friends":
        return <Contacts />;
      case "contacts":
        return <Contacts defaultContactTap="allUsers" />;
      case "setting":
        return <Setting />;
    }
  }

  return (
    <section
      className={`relative flex h-screen border-r border-primary-800 md:shrink md:basis-[25rem] lg:basis-[30rem]`}
    >
      <Sidebar tap={tap} setTap={setTap} />
      <AnimatePresence initial={false} mode="wait">
        <article className="flex-1 py-6 px-4">
          <motion.div
            key={tap}
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="h-[calc(100%-50px)]"
          >
            <h1 className="mb-4 border-b-2 pb-2 text-2xl font-semibold capitalize dark:border-primary-800 dark:text-primary-200">
              {tap}
            </h1>
            <ErrorBoundary>
              <Suspense>{currentTap()}</Suspense>
            </ErrorBoundary>
          </motion.div>
        </article>
      </AnimatePresence>
    </section>
  );
}

export default SideBox;
