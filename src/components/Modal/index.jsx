import { createPortal } from "react-dom";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

import Backdrop from "components/Backdrop";
import Button from "components/Button";
import { modalVariants } from "util/motionVariants";

const Modal = ({
  loading,
  closeModal,
  className,
  modalTitle,
  children,
  actionButtonName,
  actionButtonHandler,
}) =>
  createPortal(
    <Backdrop onClick={() => (loading ? null : closeModal())}>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={`flex max-w-full cursor-auto flex-col gap-4 rounded-xl p-6 text-sm dark:bg-primary-800 dark:text-primary-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {modalTitle?.text && (
          <h1 className="flex items-center justify-center gap-2 text-xl font-semibold">
            {modalTitle?.text} {modalTitle?.icon ?? ""}
          </h1>
        )}
        {children}
        <div className="flex gap-4">
          <Button
            onClick={() => (loading ? null : closeModal())}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => (loading ? null : actionButtonHandler(e))}
            className="flex-1"
          >
            {actionButtonName}
          </Button>
        </div>
      </motion.div>
    </Backdrop>,
    document.getElementById("modal")
  );

Modal.propTypes = {
  loading: PropTypes.bool,
  closeModal: PropTypes.func,
  className: PropTypes.string,
  modalTitle: PropTypes.shape({
    text: PropTypes.string,
    icon: PropTypes.element,
  }),
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  actionButtonName: PropTypes.string,
  actionButtonHandler: PropTypes.func,
};

Modal.defaultProps = {
  modalTitle: { text: "" },
};

export default Modal;
