export const Img = ({ width, height, className, borderRadius }) => (
    <div
        style={{ width, height, borderRadius }}
        className={`h-full w-full animate-pulse dark:bg-primary-700/75 ${className}`}
    ></div>
)