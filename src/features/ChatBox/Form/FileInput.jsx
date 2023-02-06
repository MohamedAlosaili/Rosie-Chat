import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";

import { useSendMessage, useFile } from "hooks";
import { fileIcon } from "imgs";
import { StatusMessage, Button, Input, Modal } from "components";

const FileInput = (props) => {
  const [file, changeFile, fileError, closePreview] = useFile();
  const [message, setMessage, sendMessageHandler, sending, sendingError] =
    useSendMessage("caption", { ...props }, closePreview);

  const { validFile } = file;
  return (
    <>
      <AnimatePresence>
        {(fileError || sendingError) && (
          <StatusMessage
            type="error"
            message={fileError ?? sendingError}
            zIndex="z-[60]"
          />
        )}
        {/* key="sendFileModal" to inform React that is the same component so no need to unmount on each render */}
        {validFile && (
          <Modal
            key="sendFileModal"
            closeModal={() => (sending ? null : closePreview())}
          >
            <div className="rounded-xl p-6 dark:bg-primary-800">
              {validFile.type.startsWith("video") ? (
                <video
                  autoPlay
                  src={file.previewUrl}
                  className="mb-2 w-80 rounded-xl"
                ></video>
              ) : (
                <img src={file.previewUrl} className="mb-2 w-80 rounded-xl" />
              )}
              <Input
                type="text"
                placeholder="Caption"
                name="caption"
                value={message.caption}
                setValue={setMessage}
              />
              <div className="mt-4 flex justify-between">
                <Button
                  disabled={sending}
                  type="button"
                  additionClasses="w-32"
                  handleClick={closePreview}
                >
                  Cancel
                </Button>
                <Button
                  disabled={sending}
                  type="button"
                  additionClasses="w-32"
                  handleClick={(e) => sendMessageHandler(e, validFile)}
                >
                  {sending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <label htmlFor="file" className="cursor-pointer px-2">
        <img
          src={fileIcon}
          className="w-6 transition dark:invert-[0.7] dark:hover:invert"
        />
      </label>
      <input
        type="file"
        id="file"
        className="hidden"
        value={file.value}
        onChange={changeFile}
      />
    </>
  );
};

export default FileInput;
