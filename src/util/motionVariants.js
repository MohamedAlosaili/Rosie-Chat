export const opacityVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const modalVariants = {
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

export const mediaVariants = (top, left, width) => {
  return {
    hidden: {
      opacity: 0,
      width: width,
      top,
      left,
      transform: "translate(0%, 0%)",
      transition: { type: "ease-out" },
    },
    visible: {
      opacity: 1,
      width: "100%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      transition: { type: "ease-in" },
    },
  };
};
