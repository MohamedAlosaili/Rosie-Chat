import { memo } from "react";
import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";
import { MdSend } from "react-icons/md";

import useSendMessage from "./useSendMessage";
import FileInput from "./FileInput";
import Button from "components/Button";
import Image from "components/Image";
import StatusMessage from "components/StatusMessage";

function Form({ scrollToBottom, selectedChat, setGreating }) {
  const [message, setMessage, sendMessageHandler, sending, sendingError] =
    useSendMessage(scrollToBottom);

  return (
    <>
      {setGreating && (
        <div
          onClick={() =>
            setMessage({
              text: `Hi ${selectedChat.name ?? ""}${
                selectedChat.isGroup ? " members" : ""
              }`,
            })
          }
          className="absolute top-1/2 left-1/2 w-max -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-xl p-4 text-center transition-colors dark:bg-primary-800 dark:text-primary-200 dark:hover:bg-primary-800/75"
        >
          <h3 className="font-semibold">No messages here yet...</h3>
          <p>
            Tap here to say Hi to{" "}
            <span className="font-semibold dark:text-primary-50">
              {selectedChat.name ?? ""} {selectedChat.isGroup && "members"}
            </span>
          </p>
          <Image
            img={{
              url: "https://media.tenor.com/XyfkuomEwj4AAAAi/hello.gif",
              name: "Greeting gif",
            }}
            className="mx-auto block aspect-square w-60 !bg-transparent"
          />
        </div>
      )}
      <form
        onSubmit={sendMessageHandler}
        className="flex items-center rounded-full border p-2 dark:border-primary-700 dark:bg-primary-900"
      >
        <AnimatePresence>
          {sendingError && (
            <StatusMessage
              type="error"
              message={
                typeof sendingError === "object"
                  ? sendingError.message
                  : sendingError
              }
            />
          )}
        </AnimatePresence>
        <FileInput
          message={message}
          setMessage={setMessage}
          sendMessageHandler={sendMessageHandler}
          sending={sending}
        />
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
            className="rounded-full"
          >
            <MdSend size={20} />
          </Button>
        </div>
      </form>
    </>
  );
}

Form.propTypes = {
  scrollToBottom: PropTypes.func,
};

export default memo(Form);
