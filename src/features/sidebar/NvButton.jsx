import { memo } from "react"
import PropTypes from "prop-types"

const NvButton = ({ handleClick, tap, img, btnTap, userName }) => {

    const buttonStyle = 
        btnTap !== "profile"
        ? `p-4 rounded-xl ${tap === btnTap ? "bg-accent active" : "dark:hover:bg-primary-700"}`  
        : `p-1 rounded-50 ring-4 ${tap === btnTap ? "ring-accent" : "ring-transparent"}`

    const imgStyle = 
        btnTap === "profile" 
        ? "w-12 rounded-50 cursor-pointer" 
        : "invert-[.7] group-hover:invert-[.3] dark:group-hover:invert-[.9] w-6 dark:group-[.active]:invert"
        

    return (
        <div className="relative">
            <button
                onClick={handleClick} 
                className={`group peer active:scale-[0.97] ${buttonStyle}`}
            >
                <img 
                    src={img} 
                    alt={btnTap === "profile" ? `${userName} photo` : `${btnTap} icon`} 
                    className={imgStyle}
                />
            </button>
            <span 
                className="absolute left-[150%] top-1/2 -translate-y-1/2 block bg-primary-200 text-primary-700 font-medium py-1 px-4 rounded-lg invisible peer-hover:visible"
            >
                {btnTap[0].toUpperCase() + btnTap.slice(1)}
            </span>
        </div>
    )
}

NvButton.propTypes = {
    handleClick: PropTypes.func.isRequired, 
    tap: PropTypes.string.isRequired, 
    img: PropTypes.string.isRequired, 
    btnTap: PropTypes.string.isRequired,
    userName: PropTypes.string
}

export default memo(NvButton)