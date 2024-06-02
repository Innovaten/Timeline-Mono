import { useState } from "react";

export default function useLoading() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function toggleLoading() {
    setIsLoading((prev) => !prev);
  }

  function resetLoading() {
    setIsLoading(false);
  }

  return { isLoading, toggleLoading, resetLoading };
}
