import { memo } from "react"
import PropTypes from "prop-types"

import { BiSearchAlt } from "react-icons/bi";

function SearchForm({ value, setValue, disabled }) {
    return (
        <form className="relative" onSubmit={e => e.preventDefault()}>
            <input
                disabled={disabled}
                type="search"
                value={value}
                onChange={setValue}
                placeholder="Search..."
                className={`peer w-full focus:outline-none rounded-full pl-4 pr-10 py-2 text-sm dark:bg-primary-800 dark:text-primary-200 
                            transition-colors placeholder:transition-colors dark:focus:placeholder:text-primary-200
                            border-2 dark:border-primary-700 dark:focus:border-accent `}
            />
            <BiSearchAlt
                size={20}
                className={`transition-colors absolute right-4 top-1/2 -translate-y-1/2 dark:peer-focus:text-primary-200`}
            />
        </form>
    )
}

SearchForm.propTypes = {
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

export default memo(SearchForm)