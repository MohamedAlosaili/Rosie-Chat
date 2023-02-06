import { memo } from "react"
import PropTypes from "prop-types"

const Tooltip = ({ text, position, className }) => {

    const locations = {
        top: "bottom-[150%] left-1/2 -translate-x-1/2 -translate-y-[15%]",
        bottom: "top-[150%] left-1/2 -translate-x-1/2 translate-y-[15%]",
        right: "top-1/2 left-[150%] translate-x-[15%] -translate-y-1/2",
        left: "top-1/2 right-[150%] -translate-x-[15%] -translate-y-1/2",
    }

    return text && (
        <div
            className={`hidden md:block w-max transition-all text-xs text-base font-medium rounded-lg invisible z-10
              absolute ${locations[position]} py-1 px-4 opacity-0 
              peer-hover:visible peer-hover:opacity-100 ${position === "top" || position === "bottom" ? "peer-hover:translate-y-0" : "peer-hover:translate-x-0 "} 
              peer-focus:visible peer-focus:opacity-100 ${position === "top" || position === "bottom" ? "peer-focus:translate-y-0" : "peer-focus:translate-x-0 "} 
              dark:bg-primary-200 
              dark:text-primary-700 
              ${className}
        `}
        >
            {text}
        </div>
    )
}

Tooltip.propTypes = {
    text: PropTypes.string.isRequired,
    position: PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
    className: PropTypes.string
}

export default memo(Tooltip)