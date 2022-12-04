import { useState } from "react"
import {SignIn, SignUp} from "../components"

export default function LogIn() {

    const [selectedTap, setSelectedTap] = useState("signin")


    return (
        <div 
            className="min-h-screen grid place-items-center"
        >
            <div className="w-96 max-w-full p-4">
                {
                    selectedTap === "signin" 
                    ? <SignIn setSelectedTap={setSelectedTap} />
                    : <SignUp setSelectedTap={setSelectedTap} />
                }
            </div>
        </div>
    )
}