import { useEffect, useState } from "react";

function useError() {
  const [error, setError] = useState(undefined);

  useEffect(() => {
    if (error) {
      let timeOut = setTimeout(() => setError(undefined), 5000);

      return () => clearTimeout(timeOut);
    }
  }, [error]);

  return [error, setError];
}

export default useError;
