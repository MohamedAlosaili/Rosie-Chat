import { useState } from "react";

import { getDownloadURL, uploadBytes } from "firebase/storage";

import { storage, ref } from "rosie-firebase";
import { useError } from "hooks";

/**
 * @description - Upload files into firebase storage
 * @param {string} [storageRoot = "images"] - Indicate the root of the file in firebase storage
 * @param {boolean} [setLoader=false] - Indicates whether it should set a loading state or not
 * @returns {Array} [fileUploader, loading, error]
 */
function useUploadFile(storageRoot = "images", setLoader = false) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useError();

  /**
   * @description - Store and retrieve file name & url
   * @param {object} file - An object that contains all file data that comes from file input (name, type, etc).
   * @param {string} id - An id to associate with the file name
   * @returns {object} fileObject that contains the name and url
   */
  async function fileUploader(file, id) {
    setLoader && setLoading(true);
    const name = file.name + id;
    try {
      const url = await uploadFileToStorage(file, name);

      return { name, url };
    } catch (error) {
      setError(error);
      loading && setLoader(false);
      console.log(error);
    }
  }

  /**
   * @description - Uploding file to the firebase storage
   * @param {object} file - An object that contains all file data that comes from file input (name, type, etc).
   * @param {string} fileName - File name to set a file reference path in firebase storage
   * @returns {string} file url
   */
  async function uploadFileToStorage(file, fileName) {
    const storageRef = ref(storage, `${storageRoot}/${fileName}`);

    await uploadBytes(storageRef, file);
    // Instead of retrieving the URL each time.
    // I choose to retrieve it once when it uploaded and store the url in firestore
    return await getDownloadURL(storageRef);
  }

  return [fileUploader, loading, error];
}

export default useUploadFile;
