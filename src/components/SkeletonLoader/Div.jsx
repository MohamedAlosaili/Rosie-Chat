const Div = ({ width, height, borderRadius, className, children }) => {
    return (
        <div
            style={{ width, height, borderRadius }}
            className={`animate-pulse dark:bg-primary-700/75 h-3 w-full rounded-full ${className}`}
        >
            {children}
        </div>
    )
}

export { Div }