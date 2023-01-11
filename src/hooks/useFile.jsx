import { useState, useEffect } from "react";
import { useError } from "hooks";

/* 
    value: "" will make onChange event fire every time the user opens the files window 
    I choose this because if the value has a path and the user selects the same path onChange won't fire.
    Another option is to omit the value after closing the file Modal
*/
const defaultFileValues = { value: "", validFile: undefined, previewUrl: "" };

function useFile() {
  const [file, setFile] = useState(defaultFileValues);
  const [error, setError] = useError();

  function changeFile(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      const { valid, error } = isFileValid(file);
      if (valid) {
        setFile((prevFile) => ({
          ...prevFile,
          validFile: file,
          previewUrl: URL.createObjectURL(file),
        }));
      } else {
        setError(error);
      }
    }
  }

  /**
   * @description Check validation of file type and file size
   * @param {object} file An object that contains all file data (type, size, etc).
   * @returns An object that contains checking results (valid) and error messages (error) if there are any.
   */
  function isFileValid(file) {
    const isTypeValid = /(image|video)/.test(file.type);
    // Files more than 15 MB are not allowed
    const isSizeValid = file.size < 15_728_640;

    const error = errorMessage(isTypeValid, isSizeValid);

    return { valid: isTypeValid && isSizeValid, error };
  }

  /**
   * @param {boolean} type - Determines whether the type is valid or not
   * @param {boolean} size - Determines whether the size is valid or not
   * @returns Error message if there is an error or undefined if not
   */
  function errorMessage(type, size) {
    let errorMessage;
    if (!type) {
      errorMessage = "File type not valid only Image/Video";
    } else if (!size) {
      errorMessage = "File size must be under 15MB";
    }
    return errorMessage;
  }

  function closePreview() {
    setFile(defaultFileValues);
  }

  return [file, changeFile, error, closePreview];
}

export default useFile;
