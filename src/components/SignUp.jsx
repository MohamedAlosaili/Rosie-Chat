import { useEffect, useState } from "react"

import { InputField } from "./"
import { signWithProviders, signUserUp } from "../auth/authentication"

import {googleLogo, checked, notChecked} from "../imgs"

export default function SignUp({ setSelectedTap }) {

    const [signUpValue, setSignUpValue] = useState({ name: "", email: "", password: "" })
    const [passwordStrength, setPasswordStrength] = useState({
        lowercase: false,
        uppercase: false,
        specialCharacter: false,
        number: false,
        eightCharacters: false
    })


    useEffect(() => {
        console.log("Password Change")
        checkPassword()
    }, [signUpValue.password])

    function checkPassword() {
        const reqex = {
            lowercase: /[a-z]+/g,
            uppercase: /[A-Z]+/g,
            specialCharacter: /\W+/g,
            number: /\d+/g,
        } 

        const matches = {
            lowercase: reqex.lowercase.test(signUpValue.password),
            uppercase: reqex.uppercase.test(signUpValue.password),
            specialCharacter: reqex.specialCharacter.test(signUpValue.password),
            number: reqex.number.test(signUpValue.password),
            eightCharacters: signUpValue.password.length >= 8
        }

        setPasswordStrength(matches)
    } 

    return (
        <section>
            <h2 className="text-[2.5rem] font-semibold text-center">Sing up.</h2>
            <p className="my-8 text-slate-400 text-center">We are excited ✨ that you will be one of us </p>
            <form 
                onSubmit={signUserUp}
                className="flex flex-col gap-6"
            >
                <InputField 
                    label="Name"
                    type="text"
                    name="name"
                    id="name"
                    value={signUpValue.name}
                    setValue={setSignUpValue}
                    placeholder="Your name"
                    required={true}
                    />
                <InputField 
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    value={signUpValue.email}
                    setValue={setSignUpValue}
                    placeholder="example@gmail.com"
                    required={true}
                    />
                <div> 
                    <InputField 
                        label="Password"
                        type="password"
                        name="password"
                        id="password"
                        value={signUpValue.password}
                        setValue={setSignUpValue}
                        placeholder="●●●●●●●●"
                        required={true}
                    />
                    <div className="flex flex-wrap mt-4">
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                                        ${passwordStrength.lowercase ? "text-slate-300" : "text-slate-500"}`
                            }
                        >
                            <img src={passwordStrength.lowercase ? checked : notChecked} alt="check image" className="w-3" />
                            One lowercase character
                        </p>
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                                        ${passwordStrength.uppercase ? "text-slate-300" : "text-slate-500"}`
                            }
                        >
                            <img src={passwordStrength.uppercase ? checked : notChecked} alt="check image" className="w-3" />
                            One uppercase character
                        </p>
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                                        ${passwordStrength.number ? "text-slate-300" : "text-slate-500"}`
                            }
                        >
                            <img src={passwordStrength.number ? checked : notChecked} alt="check image" className="w-3" />
                            One number
                        </p>
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                                        ${passwordStrength.specialCharacter ? "text-slate-300" : "text-slate-500"}`
                            }
                        >
                            <img src={passwordStrength.specialCharacter ? checked : notChecked} alt="check image" className="w-3" />
                            One special character
                        </p>
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                                        ${passwordStrength.eightCharacters ? "text-slate-300" : "text-slate-500"}`
                            }
                        >
                            <img src={passwordStrength.eightCharacters ? checked : notChecked} alt="check image" className="w-3" />
                            8 characters minimum
                        </p>
                    </div>
                </div>
                <button 
                    className="bg-indigo-600 hover:bg-indigo-700 p-2 mb-6 rounded-xl active:scale-[0.98] text-xm"
                >
                    Create account
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
                Sign up with Google
            </button>
            <p className="mt-6 text-sm text-center text-slate-400">
                Already have an account? 
                <a 
                    onClick={() => setSelectedTap("signin")}
                    className="text-sky-500 hover:text-sky-600 cursor-pointer"
                > Sign in</a>
            </p>
        </section >
    )
}