import { motion } from "framer-motion";

import { opacityVariants } from "util"

const Backdrop = ({ onClick, children }) => {
  return (
    <motion.div
      variants={opacityVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClick}
      className={`fixed inset-0 flex justify-center items-center bg-black/40 p-4 z-40 cursor-pointer`}
    >
      <button className="fixed top-4 right-4 text-xl">✖</button>
      {children}
    </motion.div>
  );
};

export default Backdrop;
