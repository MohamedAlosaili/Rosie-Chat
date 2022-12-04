import { useState, useEffect } from "react"


const reqex = {
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/g
}

export default function InputField({
    label, type, name, id, value, setValue, placeholder, required
}) {

    const [valid, setValid] = useState(() => {
        return reqex[type]?.test(value) ?? true
    })
    
    useEffect(() => {
        if(type === "email" || type === "password")
            setValid(reqex[type].test(value))
    }, [value])

    function changeValue(e) {
        const {name, value} = e.target
    
        setValue(prevValue => ({
            ...prevValue,
            [name]: value
        }))
    }

    const color = valid ? "sky-500" : "pink-500" 
    console.log(color)
    return (
        <label 
            htmlFor={id}
            className={`flex flex-col w-100 gap-2 text-sm`}
        >
            <div>
                {label} {required && <span className="text-pink-500">*</span>}    
            </div>
            <input 
                className={
                    `p-3 text-sm rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 focus:outline-none 
                    focus:border-sky-500 focus:text-sky-500 focus:invalid:border-pink-500 focus:invalid:text-pink-500`
                }
                type={type}
                name={name}
                id={id}
                value={value}
                required={required}
                placeholder={placeholder}
                onChange={changeValue}
            />
        </label>
    )
}