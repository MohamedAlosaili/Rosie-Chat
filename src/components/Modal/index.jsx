import { createPortal } from "react-dom";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

import Backdrop from "components/Backdrop";
import Button from "components/Button";

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 1,
    y: -30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
};

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
        transition={{ y: { duration: 0.25, type: "Tween" } }}
        className={`flex w-96 max-w-full cursor-auto flex-col gap-4 rounded-xl bg-primary-300 p-6 text-sm text-primary-900 dark:bg-primary-800 dark:text-primary-200 ${className}`}
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
