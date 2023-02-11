import { motion } from "framer-motion";

import { opacityVariants } from "util/motionVariants";

const Backdrop = ({ onClick, children }) => {
  return (
    <motion.div
      variants={opacityVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClick}
      className={`fixed inset-0 z-40 flex cursor-pointer items-center justify-center bg-black/40 p-4`}
    >
      <button className="fixed top-4 right-4 text-xl">✖</button>
      {children}
    </motion.div>
  );
};

export default Backdrop;
