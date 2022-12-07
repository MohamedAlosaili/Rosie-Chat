import { useState } from "react"

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"

import { Input, StatusMessage } from "../components"
import { auth } from "../firebase"

function SignIn() {

    const [signInValue, setSignInValue] = useState({ email: "", password: "" })
    const [signInWithEmailAndPassword, , loading, error] = useSignInWithEmailAndPassword(auth);

    async function signUserIn(e) {
        e.preventDefault()

        const {email, password} = signInValue
        if(email && password) await signInWithEmailAndPassword(email, password)
    }

    return (
        <>
            {loading && <StatusMessage message="Signing in..." type="loading" />}
            {error && <StatusMessage message={error?.code} type="error" />}
            <form 
                onSubmit={signUserIn}
                className="flex flex-col gap-8"
            >
                <Input 
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    value={signInValue.email}
                    setValue={setSignInValue}
                    placeholder="example@gmail.com"
                    required={true}
                />
                <Input 
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    value={signInValue.password}
                    setValue={setSignInValue}
                    placeholder="●●●●●●●●"
                    required={true}
                />
                <button 
                    disabled={loading}
                    className="bg-accent hover:bg-accent-600 p-2 mb-6 rounded-xl active:scale-[0.98] text-primary-200 font-medium"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </>
    )
}

export default SignIn
