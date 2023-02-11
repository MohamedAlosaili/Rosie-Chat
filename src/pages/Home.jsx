import { memo } from "react";

import { UserContextProvider } from "src/context/UserContext";
import { ChatContextProvider } from "src/context/ChatContext";
import SideBox from "features/SideBox";
import ChatBox from "features/ChatBox";

function Home() {
  return (
    <div className={`absolute inset-0 overflow-hidden md:flex`}>
      <UserContextProvider>
        <ChatContextProvider>
          <SideBox />
          <ChatBox />
        </ChatContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default memo(Home);
