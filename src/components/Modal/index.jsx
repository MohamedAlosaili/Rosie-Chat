import { motion } from "framer-motion";
import Backdrop from "../Backdrop";

const variants = {
  hidden: {
    opacity: 0,
    scale: 1,
    y: "-100vh",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: "0vh",
  },
};

const Modal = ({ children, closeModal }) => {
  return (
    <Backdrop onClick={closeModal}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={closeModal}
      >
        {children}
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
