import { memo, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const MessageBox = ({
  message,
  setMessage,
  loading,
  className,
  placeholder,
  hasInitialValue,
}) => {
  const textBoxRef = useRef(null);

  useEffect(() => {
    if (textBoxRef.current && hasInitialValue) {
      textBoxRef.current.innerHTML = message.text;
    }
  }, [hasInitialValue]);

  if (textBoxRef.current && message.text === "") {
    textBoxRef.current.innerHTML = "";
  }

  function handlePaste(event) {
    event.preventDefault();

    const plaintext = event.clipboardData.getData("text/plain");

    event.target.innerHTML = plaintext;
    setMessage(event);
  }

  return (
    <div className="relative flex-1">
      <div
        ref={textBoxRef}
        contentEditable={!loading}
        onInput={setMessage}
        style={{ wordBreak: "break-word" }}
        onPaste={handlePaste}
        className={`no-scrollbar peer max-h-[6rem] overflow-x-hidden overflow-y-scroll whitespace-pre-wrap break-words px-4 text-primary-900 focus:outline-none dark:text-primary-200 ${className}`}
        role="textbox"
      ></div>
      {message.text === "" && (
        <span className="pointer-events-none absolute left-4 top-1/2 w-full -translate-y-1/2 text-primary-700 transition-opacity peer-focus:opacity-0 dark:text-primary-400">
          {placeholder}
        </span>
      )}
    </div>
  );
};

MessageBox.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
  }),
  setMessage: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  hasInitialValue: PropTypes.bool,
};

export default memo(MessageBox);
