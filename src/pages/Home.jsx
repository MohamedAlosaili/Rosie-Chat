import { SideBox } from "features/sidebox"
import { ChatBox } from "features/chatbox"


export default function Home() {
  return (
    <div className="absolute inset-0 overflow-hidden flex">
      <SideBox />
      <ChatBox />
    </div>
  );
}
