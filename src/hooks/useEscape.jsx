import { useEffect } from "react";

function useEscape(closeHandler) {
  useEffect(() => {
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  function close(e) {
    if (e.key === "Escape") {
      closeHandler();
    }
  }
}

export default useEscape;
