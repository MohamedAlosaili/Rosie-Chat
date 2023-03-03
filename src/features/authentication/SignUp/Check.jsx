import { memo } from "react";

import { FaCheckCircle } from "react-icons/fa";

const Check = ({ condition, passed }) => {
  return (
    <p
      className={`mt-2 flex basis-2/4 items-center gap-1 text-xs font-semibold
            ${
              passed
                ? "text-primary-700 dark:text-primary-200"
                : "text-slate-400"
            }`}
    >
      <FaCheckCircle size={12} className={passed ? "text-green-600" : ""} />
      {condition}
    </p>
  );
};

// memo() helps stop unnecessary re-render
export default memo(Check);
