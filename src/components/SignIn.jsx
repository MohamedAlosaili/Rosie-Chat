import { useState } from "react"

import { InputField } from "./"
import { signWithProviders, signUserIn } from "../auth/authentication"

import googleLogo from "../imgs/Google_Logo.svg"

export default function SignIn({ setSelectedTap }) {

    const [signInValue, setSignInValue] = useState({ email: "", password: "" })

    return (
        <section>
            <h2 className="text-[2.5rem] font-semibold text-center">
                Sign in.
            </h2>
            <p className="my-8 text-slate-400 text-center">Welcome back! 👋 <br /> Please enter your details.</p>
            <form 
                onSubmit={signUserIn}
                className="flex flex-col gap-8"
            >
                <InputField 
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    value={signInValue.email}
                    setValue={setSignInValue}
                    placeholder="example@gmail.com"
                    />
                <InputField 
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    value={signInValue.password}
                    setValue={setSignInValue}
                    placeholder="●●●●●●●●"
                />
                <button 
                    className="bg-indigo-600 hover:bg-indigo-700 p-2 mb-6 rounded-xl active:scale-[0.98] text-xm"
                >
                    Sign in
                </button>
            </form>
            <div className="relative before:absolute before:left-0 before:top-[50%] before:-mt-px before:h-0.5 before:w-full before:bg-slate-600">
                <span className="relative block h-full w-16 bg-slate-900 mx-auto text-center">or</span>
            </div>
            <button 
                onClick={signWithProviders.bind(this, "google")}
                className="flex gap-3 items-center justify-center w-full p-2 rounded-xl mt-6 border-2 border-slate-700 hover:bg-slate-700"
            >
                <img src={googleLogo} alt="Google logo" className="w-5" />
                Sign in with Google
            </button>
            <p className="mt-6 text-sm text-center text-slate-400">
                Don't have an account?  
                <a 
                    onClick={() => setSelectedTap("signup")} 
                    className="text-sky-500 hover:text-sky-600 cursor-pointer"
                > Sign up
                </a>
            </p>
        </section>
    )
}