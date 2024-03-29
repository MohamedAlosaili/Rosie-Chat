import { memo, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";
import { MdSend } from "react-icons/md";

import useSendMessage from "./useSendMessage";
import FileInput from "./FileInput";
import Button from "components/Button";
import Image from "components/Image";
import StatusMessage from "components/StatusMessage";
import MessageBox from "components/MessageBox";

function Form({ scrollToBottom, selectedChat, setGreeting }) {
  const [message, setMessage, sendMessageHandler, sending, sendingError] =
    useSendMessage(scrollToBottom);

  const textFieldRef = useRef(null);
  const isGreetingClicked = useRef(false);

  useEffect(() => textFieldRef.current?.focus(), []);

  const greetingBoxHandler = () => {
    isGreetingClicked.current = true;
    setMessage({
      text: `Hi ${selectedChat.name ?? ""}${
        selectedChat.isGroup ? " members" : ""
      }`,
    });
  };

  return (
    <>
      {setGreeting && (
        <div
          onClick={greetingBoxHandler}
          className="absolute top-1/2 left-1/2 w-max max-w-[90%] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-xl bg-primary-300 p-4 text-center text-primary-900 transition-colors hover:bg-primary-400/50 dark:bg-primary-800 dark:text-primary-200 dark:hover:bg-primary-800/75"
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
        className="flex items-center rounded-full border border-primary-400/50 bg-primary-200 p-2 dark:border-primary-700 dark:bg-primary-900"
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
        <MessageBox
          message={message}
          setMessage={(e) => setMessage({ text: e.target.innerText })}
          loading={sending}
          className="bg-primary-200 dark:bg-primary-900"
          placeholder="Type a message"
          hasInitialValue={isGreetingClicked.current}
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
