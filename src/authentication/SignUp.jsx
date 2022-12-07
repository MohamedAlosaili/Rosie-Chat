import { useEffect, useState } from "react"

import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth"

import { Input, StatusMessage } from "../components"
import { auth } from "../firebase"

import {checked, notChecked} from "../imgs"

function SignUp() {

    const regex = {
        email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 
        password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}$/g
    }

    const [signUpValue, setSignUpValue] = useState({ name: "", email: "", password: "" })
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
    const [passwordStrength, setPasswordStrength] = useState({
        lowercase: false,
        uppercase: false,
        specialCharacter: false,
        number: false,
        eightCharacters: false
    })
    const [submitForm, setSubmitForm] = useState(false)

    useEffect(() => {
        if(signUpValue.password !== "")
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

    async function signUserIn(e) {
        e.preventDefault()
        setSubmitForm(true)
        const {email, password} = signUpValue

        if(regex["email"].test(email) && regex["password"].test(password)) 
            await createUserWithEmailAndPassword(email, password)
    }
    
    return (
        <>
            {loading && <StatusMessage message="Creating account..." type="loading" />}
            {error && <StatusMessage message={error?.code} type="error" />}
            <form 
                onSubmit={signUserIn}
                className="flex flex-col gap-6"
                >
                <Input 
                    label="Name"
                    type="text"
                    name="name"
                    id="name"
                    value={signUpValue.name}
                    setValue={setSignUpValue}
                    placeholder="Your name"
                    required={true}
                    />
                <Input 
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    value={signUpValue.email}
                    setValue={setSignUpValue}
                    placeholder="example@gmail.com"
                    required={true}
                    validateValue={true}
                    submitForm={submitForm}
                    setSubmitForm={setSubmitForm}
                    />
                <div> 
                    <Input 
                        label="Password"
                        type="password"
                        name="password"
                        id="password"
                        value={signUpValue.password}
                        setValue={setSignUpValue}
                        placeholder="●●●●●●●●"
                        required={true}
                        validateValue={true}
                        submitForm={submitForm}
                        setSubmitForm={setSubmitForm}
                        />
                    <div className="flex flex-wrap mt-4">
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                            ${passwordStrength.lowercase ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}`
                        }
                        >
                            <img src={passwordStrength.lowercase ? checked : notChecked} alt="check image" className="w-3" />
                            One lowercase character
                        </p>
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                            ${passwordStrength.uppercase ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}`
                        }
                        >
                            <img src={passwordStrength.uppercase ? checked : notChecked} alt="check image" className="w-3" />
                            One uppercase character
                        </p>
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                            ${passwordStrength.number ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}`
                        }
                        >
                            <img src={passwordStrength.number ? checked : notChecked} alt="check image" className="w-3" />
                            One number
                        </p>
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                            ${passwordStrength.specialCharacter ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}`
                        }
                        >
                            <img src={passwordStrength.specialCharacter ? checked : notChecked} alt="check image" className="w-3" />
                            One special character
                        </p>
                        <p 
                            className={`flex items-center basis-2/4 text-xs gap-1 mb-2 
                            ${passwordStrength.eightCharacters ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}`
                        }
                        >
                            <img src={passwordStrength.eightCharacters ? checked : notChecked} alt="check image" className="w-3" />
                            8 characters minimum
                        </p>
                    </div>
                </div>
                <button 
                    disabled={loading}
                    className="bg-accent hover:bg-accent-600 p-2 mb-6 rounded-xl active:scale-[0.98] text-primary-200 font-medium"
                    >
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>
        </>
    )
}

export default SignUp
