import { useState, useRef } from "react";
import PropTypes from "prop-types";

import { useSendMessage } from "hooks";

import FileInput from "./FileInput";
import { send } from "imgs";

function Form(props) {
  const [message, setMessage, sendMessage, sending] = useSendMessage("text", {
    ...props,
  });

  return (
    <form
      onSubmit={sendMessage}
      className="flex items-center rounded-full border p-2 dark:bg-primary-900 dark:border-primary-700"
    >
      <FileInput {...props} />
      <input
        type="text"
        placeholder="Type a message"
        value={message.text}
        onChange={(e) => setMessage({ text: e.target.value })}
        className="flex-1 text-primary-200 px-4 focus:outline-none bg-transparent"
      />
      <button
        disabled={message.text.trim() === "" || sending}
        className={`w-10 aspect-square grid place-items-center rounded-50 bg-accent 
                            ${
                              message.text.trim() !== "" && !sending
                                ? "hover:bg-accent-600 active:scale-[0.98]"
                                : ""
                            }`}
      >
        <img src={send} className="invert" />
      </button>
    </form>
  );
}

Form.propTypes = {};

export default Form;
