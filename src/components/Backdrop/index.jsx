import { motion } from "framer-motion";

import { opacityVariants } from "util"

const Backdrop = ({ onClick, children, opacity }) => {
  return (
    <motion.div
      variants={opacityVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClick}
      style={{ "--bg-color": `rgba(0, 0, 0, ${opacity}%)` }}
      className={`fixed inset-0 flex justify-center items-center bg-[var(--bg-color)] z-50 cursor-pointer`}
    >
      <button className="fixed top-4 right-4 text-xl">✖</button>
      {children}
    </motion.div>
  );
};

Backdrop.defaultProps = {
  opacity: 40,
};

export default Backdrop;
