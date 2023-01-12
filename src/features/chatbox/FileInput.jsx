import { useRef, useState } from "react";
import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";

import { useSendMessage, useFile } from "hooks";
import { fileIcon } from "imgs";
import { Button, Input, Modal } from "components";
import { StatusMessage } from "../../components";

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
            <div className="p-6 rounded-xl dark:bg-primary-800">
              {validFile.type.startsWith("video") ? (
                <video
                  autoPlay
                  src={file.previewUrl}
                  className="w-80 rounded-xl mb-2"
                ></video>
              ) : (
                <img src={file.previewUrl} className="w-80 rounded-xl mb-2" />
              )}
              <Input
                type="text"
                placeholder="Caption"
                name="caption"
                value={message.caption}
                setValue={setMessage}
              />
              <div className="flex justify-between mt-4">
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
          className="transition w-6 dark:invert-[0.7] dark:hover:invert"
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
