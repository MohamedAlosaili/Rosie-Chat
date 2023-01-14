import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Backdrop = ({ onClick, children, opacity }) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClick}
      style={{ "--bg-color": `rgba(0, 0, 0, ${opacity}%)` }}
      className={`fixed inset-0 flex justify-center items-center bg-[var(--bg-color)] z-50 cursor-pointer`}
    >
      {children}
    </motion.div>
  );
};

Backdrop.defaultProps = {
  opacity: 40,
};

export default Backdrop;
