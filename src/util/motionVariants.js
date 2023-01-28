export const opacityVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 1,
    y: -30,
    transition: { y: { duration: 0.25, type: "Tween" } },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { y: { duration: 0.25, type: "Tween" } },
  },
};

export const fadeInLeft = {
  hidden: {
    x: "-30%",
    opacity: 0,
  },
  visible: {
    x: "0%",
    opacity: 1,
  },
};

export const buttonMotion = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};
