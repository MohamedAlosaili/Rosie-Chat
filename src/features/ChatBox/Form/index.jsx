import { useEffect } from "react";
import PropTypes from "prop-types";

import { useSendMessage } from "hooks";

import FileInput from "./FileInput";
import { send } from "imgs";
import { Button } from "components";

function Form({ selectedChat, scrollToBottom, greeting }) {
  const [message, setMessage, sendMessageHandler, sending] = useSendMessage(
    "text",
    { selectedChat, scrollToBottom },
    () => null,
    greeting
  );

  useEffect(() => {
    if (greeting) {
      setMessage({ text: greeting });
    }
  }, [greeting]);

  return (
    <form
      onSubmit={sendMessageHandler}
      className="flex items-center rounded-full border p-2 dark:border-primary-700 dark:bg-primary-900"
    >
      <FileInput selectedChat={selectedChat} scrollToBottom={scrollToBottom} />
      <input
        type="text"
        placeholder="Type a message"
        value={sending ? "" : message.text}
        onChange={(e) => setMessage({ text: e.target.value })}
        className="flex-1 bg-transparent px-4 text-primary-200 focus:outline-none"
      />
      <Button
        disabled={message.text.trim() === "" || sending}
        additionClasses="rounded-50"
      >
        <img src={send} className="invert" />
      </Button>
    </form>
  );
}

Form.propTypes = {
  selectedChat: PropTypes.object,
  scrollToBottom: PropTypes.func,
};

export default Form;
