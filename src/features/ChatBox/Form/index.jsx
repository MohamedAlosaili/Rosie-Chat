import { memo, useEffect } from "react";
import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";
import { MdSend } from "react-icons/md";

import FileInput from "./FileInput";
import useSendMessage from "./useSendMessage";
import Button from "components/Button";
import StatusMessage from "components/StatusMessage";

function Form({ scrollToBottom, greeting }) {
  const [message, setMessage, sendMessageHandler, sending, sendingError] =
    useSendMessage("text", scrollToBottom);

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
      <AnimatePresence>
        {sendingError && <StatusMessage type="error" message={sendingError} />}
      </AnimatePresence>
      <FileInput scrollToBottom={scrollToBottom} />
      <input
        type="text"
        placeholder="Type a message"
        value={sending ? "" : message.text}
        onChange={(e) => setMessage({ text: e.target.value })}
        className="flex-1 bg-transparent px-4 text-primary-200 focus:outline-none"
      />
      <div
        className={`rounded-full transition-transform ${
          message.text.trim() === "" ? "scale-0" : "scale-100"
        }`}
      >
        <Button
          disabled={message.text.trim() === "" || sending}
          additionClasses="rounded-full"
        >
          <MdSend size={20} />
        </Button>
      </div>
    </form>
  );
}

Form.propTypes = {
  scrollToBottom: PropTypes.func,
  greeting: PropTypes.string,
};

export default memo(Form);
