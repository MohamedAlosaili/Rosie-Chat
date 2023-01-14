import { motion } from "framer-motion";
import Backdrop from "../Backdrop";

import { modalVariants } from "util"

const Modal = ({ closeModal, opacity, customVariants, className, style, children }) => {
  return (
    <Backdrop onClick={closeModal} opacity={opacity}>
      <motion.div
        variants={customVariants ?? modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={style}
        className={`cursor-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
