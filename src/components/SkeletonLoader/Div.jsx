const Div = ({ width, height, borderRadius, className, children }) => {
  return (
    <div
      style={{ width, height, borderRadius }}
      className={`h-3 w-full animate-pulse rounded-full bg-primary-400/50 dark:bg-primary-700/75 ${className}`}
    >
      {children}
    </div>
  );
};

export { Div };
