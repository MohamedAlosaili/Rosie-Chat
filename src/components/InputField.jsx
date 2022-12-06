import { useState, useEffect } from "react"
import PropTypes from "prop-types"

function Input({
    label, 
    type, 
    name, 
    id, 
    value, 
    setValue, 
    placeholder, 
    required, 
    validateValue, 
    submitForm, 
    setSubmitForm
}) {
    const regex = {
        email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 
        password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}$/g
    }

    const [valid, setValid] = useState(() => true)
    
    useEffect(() => {
        if(validateValue) {  
            setValid(regex[type]?.test(value))
        }
    }, [value])

    function changeValue(e) {
        const {name, value} = e.target
    
        setValue(prevValue => ({
            ...prevValue,
            [name]: value
        }))
        submitForm && setSubmitForm(false)
    }
    
    const colors = submitForm && !valid ? "border-pink-500 text-pink-500" : "border-slate-700"
    const focusColors = valid ? "focus:border-sky-500 focus:text-sky-500" : "focus:border-pink-500 focus:text-pink-500"

    return (
        <label 
            htmlFor={id}
            className={`flex flex-col w-100 gap-2 text-sm relative`}
        >
            <div>
                {label} {required && <span className="text-pink-500">*</span>}    
            </div>
            <input 
                className={
                    `p-3 text-sm rounded-xl bg-slate-800 hover:bg-slate-700 border-2 ${colors} focus:outline-none 
                    ${focusColors}
                    `
                }
                type={type}
                name={name}
                id={id}
                value={value}
                required={required}
                placeholder={placeholder}
                onChange={changeValue}
            />
            {
                submitForm && !valid 
                && <span className="absolute top-1 right-2 text-pink-500 text-xs">{
                    type === "email" ? "Invalid email" : "Invalid password"
                }</span>
            }
        </label>
    )
}

Input.propTypes = {
    label: PropTypes.string, 
    type: PropTypes.string.isRequired, 
    name: PropTypes.string.isRequired, 
    id: PropTypes.string, 
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired, 
    setValue: PropTypes.func.isRequired, 
    placeholder: PropTypes.string, 
    require: PropTypes.bool, 
    validateValue: PropTypes.bool, 
    submitForm: PropTypes.bool, 
    setSubmitForm: PropTypes.func
}

Input.defaultProps = {
    label: "",
    id: "",
    placeholder: "",
    require: false,
    validateValue: false,
    submitForm: false
}

export default Input