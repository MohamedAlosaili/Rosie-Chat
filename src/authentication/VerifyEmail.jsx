import PropTypes from "prop-types"
import { useEffect } from "react"

import { signOut } from "firebase/auth"

import { useSendEmailVerification } from "react-firebase-hooks/auth"

import { auth } from "../firebase"
import { StatusMessage } from "../components"

import {verifyEmail} from "../imgs"
import { useState } from "react"

const VerifyEmail = ({ user, selectedTap, setSelectedTap }) => {
    
    const [sendEmailVerification, sending, error] = useSendEmailVerification(auth)
    const [timer, setTimer] = useState(() => {
        const sessionTimer = JSON.parse(sessionStorage.getItem("timer"))
        if(sessionTimer && +sessionTimer.minutes !== 0 && +sessionTimer.seconds !== 0) return sessionTimer

        const newTimer = { minutes: "01", seconds: "59", isFinished: false }
        return newTimer
    })

    let interval;
    useEffect(() => {
        interval = setInterval(countDown, 1000)
        
        const emailSent = JSON.parse(sessionStorage.getItem("email-sent"))
        
        if(!emailSent) {
            sendVerificationEmail()
            sessionStorage.setItem("email-sent", true)
        }
        
        return () => clearInterval(interval)
    }, [])
    
    // store the remaining timer in sessionStorage if the component unmount
    useEffect(() => () => sessionStorage.setItem("timer", JSON.stringify(timer)), [timer])

    // change the emailSent state depending on the timer or if rsend clicked
    useEffect(() => {
        timer.isFinished && sessionStorage.setItem("email-sent", false)

        if(+timer.seconds > 0 && !timer.isFinished) 
            sessionStorage.setItem("email-sent", true)
    }, [timer.isFinished])

    async function sendVerificationEmail() {
        if(timer.isFinished) {
            interval = setInterval(countDown, 1000)
            setTimer({
                minutes: "01", 
                seconds: "59",
                isFinished: false
            })
        }
        await sendEmailVerification()
    }
    
    function countDown() {
        setTimer(({minutes, seconds, isFinished}) => {
            let newMin = +minutes
            let newSec = seconds - 1

            if(+minutes === 0 && +seconds === 0) {
                clearInterval(interval); 
                return  { minutes: `00`, seconds: `00`, isFinished: true} 
            }
            if(newSec < 0) {
                newMin = 0
                newSec = 59
            }

            return {
                minutes: `0${newMin}`,
                seconds: newSec < 10 ? `0${newSec}` : newSec,
                isFinished
            }
        })
    }

    function backToSignInPage() {
        selectedTap === "signup" && setSelectedTap("signin")

        signOut(auth)
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
                    disabled={!timer.isFinished}
                    className={
                        `bg-accent p-2 rounded-xl ${timer.isFinished && "active:scale-[0.98] hover:bg-accent-600"}
                         ${!timer.isFinished && "cursor-not-allowed"} text-sm font-medium flex-1 text-primary-200`
                    }
                >
                    Resend Email
                </button>  
                <button 
                    onClick={backToSignInPage}
                    className="bg-accent hover:bg-accent-600 p-2 rounded-xl active:scale-[0.98] text-sm font-medium flex-1 text-primary-200"
                >
                    Sign in
                </button> 
            </div> 
        </div>
    )
}

VerifyEmail.propType = {
    user: PropTypes.object.isRequired,
    selectedTap: PropTypes.string,
    setSelectedTap: PropTypes.func
}

export default VerifyEmail