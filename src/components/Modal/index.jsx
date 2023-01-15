import { motion } from "framer-motion";
import Backdrop from "../Backdrop";

import { modalVariants } from "util"

const Modal = ({ closeModal, opacity, customVariants, className, children }) => {
  return (
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
    </Backdrop>
  );
};

export default Modal;
