import { useRef, useState } from "react";
import PropTypes from "prop-types";

import { fileIcon } from "imgs";
import { Button, Input } from "components";
import { useSendMessage } from "hooks";

const FileInput = (props) => {
  const [preview, setPreview] = useState(null);
  const [message, setMessage, sendMessage, loading, fileRef] = useSendMessage(
    "caption",
    { ...props },
    setPreview
  );

  function changeFile(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      fileRef.current = file;
      // Generate URL for file preview before sending it
      setPreview(URL.createObjectURL(file));
    }
  }

  function closePreview() {
    fileRef.current = null;
    setPreview(null);
    setMessage({ caption: "" });
  }

  return (
    <>
      {preview && (
        <div className="fixed inset-0 z-10 grid place-items-center p-4 before:absolute before:inset-0 before:opacity-30 before:-z-10 before:bg-black">
          <div className="p-6 rounded-xl dark:bg-primary-800">
            <img src={preview} className="w-80 rounded-xl mb-2" />
            <Input
              type="text"
              placeholder="Caption"
              name="caption"
              value={message.caption}
              setValue={setMessage}
            />
            <div className="flex justify-between mt-4">
              <Button
                disabled={loading}
                type="button"
                additionClasses="w-32"
                handleClick={closePreview}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                type="button"
                additionClasses="w-32"
                handleClick={sendMessage}
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
      <label htmlFor="file" className="cursor-pointer px-2">
        <img
          src={fileIcon}
          className="transition w-6 dark:invert-[0.7] dark:hover:invert"
        />
      </label>
      <input type="file" id="file" className="hidden" onChange={changeFile} />
    </>
  );
};

export default FileInput;
