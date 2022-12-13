import { memo } from "react"
import PropTypes from "prop-types"

const Button = ({children, handleClick, bg, padding, additionClasses}) => {


    const bgColor = 
        (bg === "full") ? 
        `bg-accent hover:bg-accent-600 ring-accent hover:ring-accent-600` : 
        `ring-slate-400 dark:ring-slate-700 hover:ring-slate-500 hover:bg-primary-100 dark:hover:bg-primary-800`

    return (
        <button 
            onClick={handleClick}
            className={
                `flex gap-3 items-center justify-center rounded-xl active:scale-[0.98] text-primary-200 font-medium
                ring-1 ${bgColor} ${padding} ${additionClasses}
                `
            }
        >
            {children}
        </button>
    )
}

Button.defaultProps = {
    bg: "full",
    padding: "p-2 mb-6" ,
    additionClasses: "" 
}

Button.propTypes = {
    children: PropTypes.oneOf([PropTypes.string, PropTypes.element]).isRequired,
    handleClick: PropTypes.func.isRequired,
    bg: PropTypes.string,
    padding: PropTypes.string,
    additionClasses: PropTypes.string
}

export default memo(Button)