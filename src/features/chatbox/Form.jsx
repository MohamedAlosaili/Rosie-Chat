import PropTypes from "prop-types";

import { useSendMessage } from "hooks";

import FileInput from "./FileInput";
import { send } from "imgs";
import { Button } from "components";

function Form(props) {
  const [message, setMessage, sendMessageHandler, sending] = useSendMessage(
    "text",
    {
      ...props,
    }
  );

  return (
    <form
      onSubmit={sendMessageHandler}
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
