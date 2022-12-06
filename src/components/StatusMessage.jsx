import PropTypes from "prop-types"

const StatusMessage = ({message, type}) => {
    // console.log(message)
    const msgColor = type === "loading" ? "bg-slate-100 text-slate-900" : "bg-pink-700"

    let errorMsg = message?.slice(message.lastIndexOf("auth/") + 5).replaceAll("-", " ")
    errorMsg = errorMsg ? errorMsg[0].toUpperCase() + errorMsg.slice(1) : "Some thing went wrong!"

    // console.log(errorMsg)
    return (
        <div 
            className={
                `fixed top-4 left-0 w-full`
            }
        >
            {
                type === "loading" 
                ? 
                <div className={`${msgColor} flex gap-4 items-center font-medium py-2 px-8 rounded-lg w-fit mx-auto`}>
                    <LoadingSpinner />
                    <p>{message}</p>
                </div> 
                :
                <div className={`${msgColor} flex gap-4 items-center font-medium py-2 px-8 rounded-lg w-fit mx-auto`}>
                    <ExclMark />
                    <p>{errorMsg}</p>
                </div> 
            }
        </div>
    )
}

const ExclMark = () => (
    <div className="border-2 border-slate-200 rounded-50 w-6 h-6 grid place-items-center font-serif text-sm">!</div>
)

const LoadingSpinner = () => (
    <div className="border-2 border-slate-300 border-t-slate-900 rounded-50 w-6 h-6 animate-spin"></div>
) 

StatusMessage.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

export default StatusMessage