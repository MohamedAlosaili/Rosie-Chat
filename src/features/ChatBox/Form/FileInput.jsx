import { memo } from "react";
import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";
import { AiOutlinePaperClip } from "react-icons/ai";

import useValidateFile from "hooks/useValidateFile";
import StatusMessage from "components/StatusMessage";
import Modal from "components/Modal";
import Video from "components/Video";
import Image from "components/Image";
import MessageBox from "components/MessageBox";

const FileInput = ({ message, setMessage, sendMessageHandler, sending }) => {
  const [file, changeFile, fileError, closePreview] = useValidateFile([
    "image",
    "video",
  ]);

  const cancelPreview = () => {
    closePreview();
    setMessage({ text: "" });
  };

  const { validFile } = file;
  return (
    <>
      <AnimatePresence>
        {fileError && <StatusMessage type="error" message={fileError} />}
        {validFile && (
          <Modal
            key="sendFileModal"
            closeModal={cancelPreview}
            actionButtonName={sending ? "Sending..." : "Send"}
            actionButtonHandler={(e) =>
              sendMessageHandler(e, validFile, closePreview)
            }
            loading={sending}
          >
            {validFile.type.startsWith("video") ? (
              <Video
                video={{ url: file.previewUrl, type: validFile.type }}
                autoPlay={true}
                className="w-full max-w-full rounded-xl"
              />
            ) : (
              <Image
                img={{ url: file.previewUrl, name: "Preview of image message" }}
                className="aspect-square w-full max-w-full rounded-xl"
              />
            )}
            <MessageBox
              message={message}
              setMessage={(e) => setMessage({ text: e.target.innerText })}
              loading={sending}
              className="rounded-xl border-2 border-primary-700 border-primary-400/50 p-3"
              placeholder="Caption"
            />
          </Modal>
        )}
      </AnimatePresence>
      <label className="cursor-pointer px-2">
        <AiOutlinePaperClip
          size={30}
          className="transition-colors hover:text-primary-900 dark:hover:text-primary-200 md:text-primary-400"
        />
        <input
          type="file"
          className="hidden"
          value={file.value}
          onChange={changeFile}
          accept="image/*, video/*"
        />
      </label>
    </>
  );
};

FileInput.propTypes = {
  message: PropTypes.shape({ text: PropTypes.string }),
  setMessage: PropTypes.func,
  sendMessageHandler: PropTypes.func,
  sending: PropTypes.bool,
};

export default memo(FileInput);
