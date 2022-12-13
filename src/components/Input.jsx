import { useState, useEffect, memo } from "react"
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
    regex,
    submitForm, 
    setSubmitForm
}) {

    const [valid, setValid] = useState(() => true)
    
    useEffect(() => {
        if(validateValue && regex) {  
            setValid(regex.test(value))
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
    

    let validationsFocus = validateValue ? `focus:ring-success focus:text-success dark:focus:text-success` : `focus:ring-accent`
    const invalidInputColors = submitForm && !valid ? `ring-error-400 text-error-400 dark:text-error-400` : ` ring-transparent text-primary-900 dark:text-primary-200`
    const focusColors = valid ? validationsFocus : `focus:ring-error-400 focus:text-error-400 dark:focus:text-error-400`

    const dark = "dark:text-primary-200 dark:bg-primary-800 dark:hover:bg-primary-700 dark:border-primary-700"
    const light = "text-primary-900 hover:bg-primary-50 border-primary-200"

    return (
        <label 
            htmlFor={id}
            className={`flex flex-col w-100 gap-2 text-sm relative font-medium`}
        >
            <div>
                {label} {required && <span className="text-error">*</span>}    
            </div>
            <input 
                className={
                    `p-3 text-sm rounded-xl border-2 ring-2 focus:outline-none focus:border-1 
                    ${light} ${dark} ${focusColors} ${invalidInputColors}`
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

// memo() helps stop unnecessary re-render
export default memo(Input)