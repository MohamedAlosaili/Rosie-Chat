import { memo } from "react";

import SideBox from "features/SideBox";
import ChatBox from "features/ChatBox";
import ErrorBoundary from "./ErrorBoundary";
import { UserContextProvider } from "context/UserContext";
import { ChatContextProvider } from "context/ChatContext";

const Home = () => (
  <div className={`relative overflow-x-hidden md:flex`}>
    <UserContextProvider>
      <ChatContextProvider>
        <SideBox />
        <ErrorBoundary>
          <ChatBox />
        </ErrorBoundary>
      </ChatContextProvider>
    </UserContextProvider>
  </div>
);

export default memo(Home);
