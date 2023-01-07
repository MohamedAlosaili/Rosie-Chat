import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Backdrop = ({ onClick, children }) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClick}
      className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
