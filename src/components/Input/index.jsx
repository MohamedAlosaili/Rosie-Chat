import { useState, memo } from "react";
import PropTypes from "prop-types";

import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs";

function Input({
  label,
  type,
  name,
  disabled,
  value,
  setValue,
  placeholder,
  required,
  valid,
  validateValue,
  submitForm,
  setSubmitForm,
}) {
  const [inputType, setInputType] = useState(type);

  function changeValue(e) {
    const { name, value } = e.target;

    setValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));

    submitForm && setSubmitForm(false);
  }

  function changePasswordState(e) {
    e.preventDefault();
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  }

  function invalidMessage() {
    switch (name) {
      case "email":
        return "Invalid email";
      case "password":
        return "Invalid password";
      case "confirmPassword":
        return "Password doesn't match";
      default:
        return "";
    }
  }

  const validFocus = "focus:ring-info focus:text-info dark:focus:text-info";
  const invalidFocus =
    "focus:ring-error-400 focus:text-error-400 dark:focus:text-error-400";

  const invalidInputColors =
    submitForm && !valid
      ? `ring-error-400 text-error-400 dark:text-error-400`
      : `ring-transparent text-primary-900 dark:text-primary-200`;

  const validateColors = valid ? validFocus : invalidFocus;
  const focusColors =
    value !== "" && validateValue ? validateColors : "focus:ring-accent";

  const dark =
    "dark:text-primary-200 dark:bg-primary-800 dark:hover:bg-primary-700 dark:border-primary-700";
  const light = "text-primary-900 hover:bg-primary-50 border-primary-200";

  return (
    <label className={`relative flex flex-col gap-2 text-sm font-medium`}>
      <div className="flex items-center gap-1">
        {label} {required && <span className="text-error-400">*</span>}
        {type === "password" && (
          <div className="ml-2 cursor-pointer" onClick={changePasswordState}>
            {inputType === "password" ? (
              <BsFillEyeSlashFill size={16} />
            ) : (
              <BsFillEyeFill size={16} />
            )}
          </div>
        )}
      </div>
      <input
        className={`focus:border-1 w-full rounded-xl border-2 p-3 text-sm ring-2 focus:outline-none
                    ${light} ${dark} ${focusColors} ${invalidInputColors}`}
        type={inputType}
        name={name}
        value={value}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        onChange={changeValue}
      />
      {submitForm && !valid && (
        <span className="absolute top-1 right-2 text-xs font-bold text-error-400">
          {invalidMessage()}
        </span>
      )}
    </label>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  require: PropTypes.bool,
  validateValue: PropTypes.bool,
  submitForm: PropTypes.bool,
  setSubmitForm: PropTypes.func,
};

Input.defaultProps = {
  label: "",
  disabled: false,
  placeholder: "",
  require: false,
  validateValue: false,
  submitForm: false,
};

// memo() helps stop unnecessary re-render
export default memo(Input);
