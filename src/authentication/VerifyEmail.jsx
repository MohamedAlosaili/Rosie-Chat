import PropTypes from "prop-types"
import { useEffect } from "react"

import { signOut } from "firebase/auth"

import { useAuthState, useSendEmailVerification } from "react-firebase-hooks/auth"

import { auth } from "../firebase"
import { StatusMessage } from "../components"

import {verifyEmail} from "../imgs"
import { useState } from "react"

const VerifyEmail = ({ user }) => {
    
    const [sendEmailVerification, sending, error] = useSendEmailVerification(auth)
    const [timer, setTimer] = useState({
        minutes: "01", 
        seconds: "59",
        isDisabled: false
    })

    let interval;
    useEffect(() => {
        console.log(sending)
        interval = setInterval(countDown, 1000)
        sendVerificationEmail()

        return () => clearInterval(interval)
    }, [])

    async function sendVerificationEmail() {
        if(timer.isDisabled) {
            interval = setInterval(countDown, 1000)
            setTimer({
                minutes: "01", 
                seconds: "59",
                isDisabled: false
            })
        }
        await sendEmailVerification()
    }
    
    function countDown() {
        setTimer(({minutes, seconds, isDisabled}) => {
            let newMin = +minutes
            let newSec = seconds - 1

            if(+minutes === 0 && +seconds === 0) {
                clearInterval(interval); 
                return  { minutes: `00`, seconds: `00`, isDisabled: true} 
            }
            if(newSec < 0) {
                newMin = 0
                newSec = 59
            }

            return {
                minutes: `0${newMin}`,
                seconds: newSec < 10 ? `0${newSec}` : newSec,
                isDisabled
            }
        })
    }

    return (
        <div className="bg-primary-100 dark:bg-primary-800 p-6 rounded-2xl text-center">
            {error && <StatusMessage message={error.code} type="error" />}
            <h1 className="text-2xl font-bold mb-6 text-primary-900 dark:text-primary-200">Verify your email</h1>
            <h3 className="text-[0.9rem] text-primary-900 dark:text-primary-200">You will need to verify your email to compelte registeration</h3>
            <img src={verifyEmail} alt="Verify Email Image" className="w-40 mx-auto my-6" />
            <p className="text-[0.9rem] ">An email has been sent to {user.email} check your spam folder if you have not received the email</p>
            <div className="my-4">{timer.minutes}:{timer.seconds}</div>
            <div className="flex gap-4">
                <button 
                    onClick={sendVerificationEmail}
                    disabled={!timer.isDisabled}
                    className={
                        `bg-accent p-2 rounded-xl ${timer.isDisabled && "active:scale-[0.98] hover:bg-accent-600"}
                         ${!timer.isDisabled && "cursor-not-allowed"} text-sm font-medium flex-1 text-primary-200`
                    }
                >
                    Resend Email
                </button>  
                <button 
                    onClick={() => signOut(auth)}
                    className="bg-accent hover:bg-accent-600 p-2 rounded-xl active:scale-[0.98] text-sm font-medium flex-1 text-primary-200"
                >
                    Sign in
                </button> 
            </div> 
                {/* <a 
                    href="mailto:mohamedweb85@gmail.com" 
                    className={
                        `border-2 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 
                        p-2 rounded-xl active:scale-[0.98] text-sm font-medium flex-1`
                    }
                >
                    Contact Support
                </a> */}
        </div>
    )
}

VerifyEmail.propType = {
    user: PropTypes.object.isRequired
}

export default VerifyEmail