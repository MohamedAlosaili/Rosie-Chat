import { createPortal } from "react-dom";

import { motion } from "framer-motion";

import Backdrop from "components/Backdrop";
import Button from "components/Button";
import { modalVariants } from "util/motionVariants";

const Modal = ({
  closeModal,
  customVariants,
  className,
  children,
  actionButtonName,
  actionButtonHandler,
}) => {
  return createPortal(
    <Backdrop onClick={closeModal}>
      <motion.div
        variants={customVariants ?? modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={`max-w-full cursor-auto rounded-xl p-6 dark:bg-primary-800 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <div className="flex gap-4">
          <Button onClick={closeModal} className="flex-1 text-sm">
            Cancel
          </Button>
          <Button onClick={actionButtonHandler} className="flex-1 text-sm">
            {actionButtonName}
          </Button>
        </div>
      </motion.div>
    </Backdrop>,
    document.getElementById("modal")
  );
};

export default Modal;
