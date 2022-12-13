import { memo } from "react"
import PropTypes from "prop-types"

const Button = ({children, handleClick, bg, padding, additionClasses, disabled}) => {


    const bgColor = 
        (bg === "full") ? 
        `bg-accent ${!disabled && "hover:bg-accent-600"} ring-accent hover:ring-accent-600` : 
        `ring-slate-400 dark:ring-slate-700 hover:ring-slate-500 hover:bg-primary-100 dark:hover:bg-primary-800`

    return (
        <button 
            disabled={disabled}
            onClick={handleClick}
            className={
                `flex gap-3 items-center justify-center rounded-xl text-primary-200 font-medium 
                ring-1 ${bgColor} ${padding} ${!disabled && "active:scale-[0.98]"} ${additionClasses}
                `
            }
        >
            {children}
        </button>
    )
}

Button.propTypes = {
    children: PropTypes.oneOf([PropTypes.string, PropTypes.element]).isRequired,
    handleClick: PropTypes.func,
    bg: PropTypes.string,
    padding: PropTypes.string,
    additionClasses: PropTypes.string,
    disabled: PropTypes.bool
}

Button.defaultProps = {
    bg: "full",
    padding: "p-2 mb-6" ,
    additionClasses: "",
    disabled: false 
}

export default memo(Button)