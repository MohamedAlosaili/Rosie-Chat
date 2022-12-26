import { useEffect, useState } from "react"
import PropTypes from "prop-types"

import { signOut, updateProfile } from "firebase/auth"
import { useSendEmailVerification } from "react-firebase-hooks/auth"

import { auth } from "rosie-firebase"
import { Button, StatusMessage } from "components"
import { verifyEmail, defaultAvatar } from "imgs"

function useSendVerification(user, isTimerRunning, resetTimer) {
  const [sendEmailVerification, sending, error] = useSendEmailVerification(auth)
  const [isEmailSend, setIsEmailSend] = useState(() => {
    const emailVerify = JSON.parse(sessionStorage.getItem("email-verify"))

    if(emailVerify?.isSend && emailVerify?.email === user.email) return emailVerify?.isSend
    else return false
  })

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("user-info"))

    if(userInfo && !user.displayName) {
        const { name } = userInfo

        updateProfile(user, { displayName: name, photoURL: defaultAvatar })
          .then(() => {
            sendVerificationEmail()
            sessionStorage.removeItem("user-info")
            sessionStorage.setItem("email-verify", JSON.stringify({ isSend: true, email: user.email }))
          }).catch(error => console.log(error))
    } else if(!isEmailSend) {
      sendVerificationEmail()
      sessionStorage.setItem("email-verify", JSON.stringify({ isSend: true, email: user.email }))
    }
  }, [])

  async function sendVerificationEmail() {
    if(!isTimerRunning) {
      resetTimer(90)
    }
    await sendEmailVerification()
  }

  return [sendVerificationEmail, error]
}

function useTimer(user) {
  const [counter, setCounter] = useState(() => {
    const storedCounter = JSON.parse(sessionStorage.getItem("counter")) 
    const verifyEmail = JSON.parse(sessionStorage.getItem("email-verify"))

    if(storedCounter > 0 && verifyEmail?.email === user.email) return storedCounter
    return 90
  })
  const [timer, setTimer] = useState(() => countDown())
  const [isTimerRunning, setIsTimerRunning] = useState(true)

  useEffect(() => {
    let timeOut
    if(counter > 0) {
      !isTimerRunning && setIsTimerRunning(true)

      timeOut = setTimeout(() => {
        setCounter(prevCounter => prevCounter - 1)
      }, 1000)
    } else {
      setIsTimerRunning(false)
    }

    return () => clearTimeout(timeOut)
  })

  useEffect(() => {
    setTimer(countDown())

    return () => sessionStorage.setItem("counter", counter)
  }, [counter])


  function countDown() {
    const min = Math.floor(counter / 60)
    const sec = counter % 60

    return `0${min}:${sec < 10 ? "0" : ""}${sec}`
  }

  return [timer, isTimerRunning, setCounter]
}

function VerifyEmail({ user, selectedTap, setSelectedTap }) {

  const [timer, isTimerRunning, resetTimer] = useTimer(user) 
  const [sendVerificationEmail, error] = useSendVerification(user, isTimerRunning, resetTimer)

  function backToSignInPage() {
    selectedTap === "signup" && setSelectedTap("signin")

    signOut(auth)
  }
  
  return (
    <div className="bg-primary-100 dark:bg-primary-800 p-6 rounded-2xl text-center">
      {error && <StatusMessage message={error.code} type="error" />}
      <h1 className="text-2xl font-bold mb-6 text-primary-900 dark:text-primary-200">
        Verify your email
      </h1>
      <h3 className="text-[0.9rem] text-primary-900 dark:text-primary-200">
        You will need to verify your email to compelte registeration
      </h3>
      <img
        src={verifyEmail}
        alt="Verify Email Image"
        className="w-40 mx-auto my-6"
      />
      <p className="text-[0.9rem] ">
        An email has been sent to {user.email} check your spam folder if you
        have not received the email
      </p>
      <div className="my-4">{timer}</div>
      <div className="flex gap-4">
        <Button
          disabled={isTimerRunning}
          handleClick={sendVerificationEmail}
          additionClasses={`flex-1 text-sm ${isTimerRunning ? "cursor-not-allowed opacity-30" : ""}`}
        >
          Resend Email
        </Button>
        <Button handleClick={backToSignInPage} additionClasses="flex-1 text-sm">
          Sign in
        </Button>
      </div>
    </div>
  )
}

VerifyEmail.propType = {
  user: PropTypes.object.isRequired,
  selectedTap: PropTypes.string,
  setSelectedTap: PropTypes.func,
}

export default VerifyEmail
