import { createPortal } from "react-dom";

import { motion } from "framer-motion";
import Backdrop from "components/Backdrop";

import { modalVariants } from "util"

const Modal = ({ closeModal, opacity, customVariants, className, children }) => {
  return createPortal(
    <Backdrop onClick={closeModal} opacity={opacity}>
      <motion.div
        variants={customVariants ?? modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={`cursor-auto max-w-full ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </Backdrop>,
    document.getElementById("modal")
  );
};

export default Modal;
