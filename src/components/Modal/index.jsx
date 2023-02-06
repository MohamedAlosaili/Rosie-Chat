import { createPortal } from "react-dom";

import { motion } from "framer-motion";
import Backdrop from "components/Backdrop";

import { modalVariants } from "util";

const Modal = ({ closeModal, customVariants, className, children }) => {
  return createPortal(
    <Backdrop onClick={closeModal}>
      <motion.div
        variants={customVariants ?? modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={`max-w-full cursor-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </Backdrop>,
    document.getElementById("modal")
  );
};

export default Modal;
