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

export const mediaVariants = (x, y) => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
      x,
      y,
    },
    visible: {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
};
