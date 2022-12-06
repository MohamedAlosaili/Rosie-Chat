import PropTypes from "prop-types"

import { signWithProviders } from "../firebase"

import googleLogo from "../imgs/Google_Logo.svg"

const Authentication = (props) => {

    function changeTap() {
        const newTap = props.selectedTap === "signin" ? "signup" : "signin"

        props.setSelectedTap(newTap)
    }

    return (
        <section>
            <h2 className="text-[2.5rem] font-semibold text-center">
                {props.title}
            </h2>
            <p className="my-8 text-slate-400 text-center">{props.greeting}</p>
            {
                props.children
            }
            <div className="relative before:absolute before:left-0 before:top-[50%] before:-mt-px before:h-0.5 before:w-full before:bg-slate-600">
                <span className="relative block h-full w-16 bg-slate-900 mx-auto text-center">or</span>
            </div>
            <button 
                onClick={signWithProviders.bind(this, "google")}
                className="flex gap-3 items-center justify-center w-full p-2 rounded-xl mt-6 border-2 border-slate-700 hover:bg-slate-700"
            >
                <img src={googleLogo} alt="Google logo" className="w-5" />
                Sign {props.selectedTap === "signin" ? "in" : "up"} with Google
            </button>
            <p className="mt-6 text-sm text-center text-slate-400">
                {
                    props.selectedTap === "signin"
                    ? "Don't have an account? "
                    : "Already have an account? "
                }  
                <a 
                    onClick={changeTap} 
                    className="text-sky-500 hover:text-sky-600 cursor-pointer"
                > 
                    {props.selectedTap === "signin" ? "Sign up" : "Sign in"}
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