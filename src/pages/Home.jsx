import { useState } from "react";

import { SideBox } from "features/sidebox"
import { ChatBox } from "features/chatbox"

export default function Home() {

  const [chatId, setChatId] = useState("")

  return (
    <div className="absolute inset-0 overflow-hidden flex">
      <SideBox setChatId={setChatId} />
      <ChatBox chatId={chatId} setChatId={setChatId} />
    </div>
  );
}
