import { useRef, useState } from "react";
import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";

import { useSendMessage } from "hooks";
import { fileIcon } from "imgs";
import { Button, Input, Modal } from "components";

const FileInput = (props) => {
  const inputFileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage, sendMessage, loading, file] = useSendMessage(
    "caption",
    { ...props },
    setPreview
  );

  // Note: if the user chooses the same file this handler won't run because the value isn't change
  function changeFile(e) {
    console.log("entered but not changed");
    if (e.target.files.length > 0) {
      const fileObj = e.target.files[0];
      file.current = fileObj;
      // Generate URL for file preview before sending it
      setPreview(URL.createObjectURL(fileObj));
    }
  }

  //
  function closePreview() {
    inputFileRef.current.value = "";
    file.current = null;
    setPreview(null);
    setMessage({ caption: "" });
  }
  console.log(preview);
  return (
    <>
      <AnimatePresence>
        {preview && (
          <Modal closeModal={closePreview}>
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
          </Modal>
        )}
      </AnimatePresence>
      <label htmlFor="file" className="cursor-pointer px-2">
        <img
          src={fileIcon}
          className="transition w-6 dark:invert-[0.7] dark:hover:invert"
        />
      </label>
      <input
        ref={inputFileRef}
        type="file"
        id="file"
        className="hidden"
        onChange={changeFile}
      />
    </>
  );
};

export default FileInput;
