import { memo } from "react";

import { checked, notChecked } from "../../imgs";

const Check = ({ condition, passed }) => {
  return (
    <p
      className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
            ${
              passed ? "text-slate-700 dark:text-slate-300" : "text-slate-400"
            }`}
    >
      <img
        src={passed ? checked : notChecked}
        alt="check image"
        className="w-3"
      />
      {condition}
    </p>
  );
};

// memo() helps stop unnecessary re-render
export default memo(Check);
