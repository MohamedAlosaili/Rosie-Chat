import { memo } from "react";
import PropTypes from "prop-types";

import { BiSearchAlt } from "react-icons/bi";

function SearchForm({ value, setValue, disabled }) {
  return (
    <form className="relative" onSubmit={(e) => e.preventDefault()}>
      <input
        disabled={disabled}
        type="search"
        value={value}
        onChange={setValue}
        placeholder="Search..."
        className={`peer w-full rounded-full border-2 border-primary-300 bg-primary-100 py-2 pl-4 pr-10 text-sm text-primary-900 transition-colors 
                            placeholder:transition-opacity focus:border-accent focus:outline-none focus:placeholder:opacity-0 dark:border-primary-700
                            dark:bg-primary-800 dark:text-primary-200 dark:focus:border-accent`}
      />
      <BiSearchAlt
        size={20}
        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors peer-focus:text-accent`}
      />
    </form>
  );
}

SearchForm.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default memo(SearchForm);
