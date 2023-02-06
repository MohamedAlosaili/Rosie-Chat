import { memo } from "react";

import { checked, notChecked } from "imgs";

const Check = ({ condition, passed }) => {
  return (
    <p
      className={`mt-2 flex basis-2/4 items-center gap-1 text-xs 
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
