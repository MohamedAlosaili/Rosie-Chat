import { memo } from "react";
import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";
import { AiOutlinePaperClip } from "react-icons/ai";

import useSendMessage from "hooks/useSendMessage";
import useValidateFile from "hooks/useValidateFile";
import StatusMessage from "components/StatusMessage";
import Button from "components/Button";
import Input from "components/Input";
import Modal from "components/Modal";
import Video from "components/Video";
import Image from "components/Image";

const FileInput = ({ scrollToBottom }) => {
  const [file, changeFile, fileError, closePreview] = useValidateFile([
    "image",
    "video",
  ]);
  const [message, setMessage, sendMessageHandler, sending, sendingError] =
    useSendMessage("caption", scrollToBottom, closePreview);

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
                <Video
                  video={{ url: file.previewUrl, type: "video/mp4" }}
                  autoPlay={true}
                  className="mb-2 w-80 rounded-xl"
                />
              ) : (
                <Image
                  img={{ url: file.previewUrl, name: "" }}
                  className="mb-2 aspect-square w-80 rounded-xl"
                />
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
        <AiOutlinePaperClip
          size={30}
          className="transition-colors dark:hover:text-primary-200"
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

FileInput.propTypes = {
  scrollToBottom: PropTypes.func,
};

export default memo(FileInput);
