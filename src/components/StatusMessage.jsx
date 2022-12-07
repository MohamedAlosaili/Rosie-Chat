import PropTypes from "prop-types"

const StatusMessage = ({message, type}) => {
    // console.log(message)
    const msgColor = 
            (type === "loading") 
            ? "bg-primary-900 dark:bg-primary-100 text-primary-200 dark:text-primary-900" 
            : "text-white bg-error"

    let errorMsg = message?.slice(message.lastIndexOf("auth/") + 5).replaceAll("-", " ")
    errorMsg = errorMsg ? errorMsg[0].toUpperCase() + errorMsg.slice(1) : "Some thing went wrong!"

    // console.log(errorMsg)
    return (
        <div 
            className={
                `fixed top-4 left-0 w-full`
            }
        >
            
                <div className={`${msgColor} flex gap-4 items-center font-medium py-2 px-8 rounded-lg w-fit mx-auto`}>
                    {
                        type === "loading" 
                        ? 
                        <>
                            <LoadingSpinner />
                            <p>{message}</p>
                        </>
                        :
                        <>
                            <ExclMark />
                            <p>{errorMsg}</p>
                        </>
                    }
                </div> 
                
        </div>
    )
}

const ExclMark = () => (
    <div className="border-2 border-primary-200 rounded-50 w-6 h-6 grid place-items-center font-serif text-sm">!</div>
)

const LoadingSpinner = () => (
    <div className="border-2 border-primary-700 border-t-primary-200 dark:border-primary-300 dark:border-t-primary-900 rounded-50 w-6 h-6 animate-spin"></div>
) 

StatusMessage.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

export default StatusMessage