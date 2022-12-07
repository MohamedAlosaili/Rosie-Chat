import PropTypes from "prop-types"

import { signWithProviders } from "../firebase"

import googleLogo from "../imgs/Google_Logo.svg"

const Authentication = ({
    title,
    greeting,
    children,
    selectedTap,
    setSelectedTap,
}) => {

    function changeTap() {
        const newTap = selectedTap === "signin" ? "signup" : "signin"

        setSelectedTap(newTap)
    }

    return (
        <section>
            <h2 className="text-[2.5rem] font-bold text-center text-primary-900 dark:text-primary-200">
                {title}
            </h2>
            <p className="my-8 text-center font-medium">{greeting}</p>
            {
                children
            }
            <div className="relative before:absolute before:left-0 before:top-[50%] before:-mt-px before:h-px before:w-full before:bg-primary-400 dark:before:bg-primary-700">
                <span className="relative block h-full w-16 bg-white dark:bg-primary-900 mx-auto text-center">or</span>
            </div>
            <button 
                onClick={signWithProviders.bind(this, "google")}
                className={
                    `flex gap-3 items-center justify-center w-full p-2 rounded-xl mt-6 ring-1 ring-slate-400 dark:ring-slate-700 
                    hover:ring-slate-500 hover:bg-primary-100 dark:hover:bg-primary-800 font-medium`
                }
            >
                <img src={googleLogo} alt="Google logo" className="w-5" />
                Sign {selectedTap === "signin" ? "in" : "up"} with Google
            </button>
            <p className="mt-6 text-sm text-center">
                {
                    selectedTap === "signin"
                    ? "Don't have an account? "
                    : "Already have an account? "
                }  
                <a 
                    onClick={changeTap} 
                    className="text-success hover:text-success-600 cursor-pointer font-medium"
                > 
                    {selectedTap === "signin" ? "Sign up" : "Sign in"}
                </a>
            </p>
        </section>
    )
}

Authentication.propTypes = {
    title: PropTypes.string,
    greeting: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    children: PropTypes.element,
    selectedTap: PropTypes.string,
    setSelectedTap: PropTypes.func
}

export default Authentication