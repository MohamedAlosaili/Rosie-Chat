import { motion } from "framer-motion";

const opacityVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Backdrop = ({ onClick, children }) => {

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <motion.div
      variants={opacityVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-40 flex cursor-pointer items-center justify-center bg-black/40 p-4 backdrop-blur-md`}
    >
      <button className="fixed top-4 right-4 text-xl">✖</button>
      {children}
    </motion.div>
  );
};

export default Backdrop;
