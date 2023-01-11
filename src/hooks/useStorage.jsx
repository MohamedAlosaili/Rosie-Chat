function useStorage(storageType = "localStorage", key) {
  function getStorageValue() {
    return JSON.parse(window[storageType].getItem(key));
  }

  function setStorageValue(value) {
    window[storageType].setItem(key, JSON.stringify(value));
  }

  function removeStorageItem() {
    window[storageType].removeItem(key);
  }

  function clearStorage() {
    window[storageType].clear();
  }

  return [getStorageValue(), setStorageValue, removeStorageItem, clearStorage];
}

export default useStorage;
