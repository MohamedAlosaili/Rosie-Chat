export default function ErrorBoundary({msg}) {

    let message = msg.slice(msg.lastIndexOf("auth/") + 5).replaceAll("-", " ")
    message = message[0].toUpperCase() + message.slice(1)

    return (
        <div 
            className="fixed top-8 left-[50%] -translate-x-1/2 bg-pink-700 py-3 px-8 rounded-xl"
        >
            {message}
        </div>
    )
}