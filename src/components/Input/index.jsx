import { useState, memo } from "react";
import PropTypes from "prop-types";

import { hidePassword, showPassword } from "imgs";

function Input({
  label,
  type,
  name,
  id,
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
    const src = e.target.src;

    if (src.includes("hide-password")) {
      e.target.src = showPassword;
      setInputType("text");
    } else {
      e.target.src = hidePassword;
      setInputType("password");
    }
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
    <label
      htmlFor={id}
      className={`w-100 relative flex flex-col gap-2 text-sm font-medium`}
    >
      <div>
        {label} {required && <span className="text-error-400">*</span>}
        {type === "password" && (
          <img
            onClick={changePasswordState}
            src={hidePassword}
            alt="hide/show password"
            className="ml-3 inline-block w-4 cursor-pointer invert-[.7] group-hover:invert-[.3] dark:group-hover:invert-[.9] dark:group-[.active]:invert"
          />
        )}
      </div>
      <input
        className={`focus:border-1 rounded-xl border-2 p-3 text-sm ring-2 focus:outline-none 
                    ${light} ${dark} ${focusColors} ${invalidInputColors}`}
        type={inputType}
        name={name}
        id={id}
        value={value}
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
  id: PropTypes.string,
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
  id: "",
  placeholder: "",
  require: false,
  validateValue: false,
  submitForm: false,
};

// memo() helps stop unnecessary re-render
export default memo(Input);
