import { memo } from "react";

import { UserContextProvider } from "hooks/context";
import { ChatContextProvider } from "hooks/context";
import { SideBox } from "features/sidebox";
import { ChatBox } from "features/chatbox";

function Home() {
  return (
    <div className="absolute inset-0 overflow-hidden flex">
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
