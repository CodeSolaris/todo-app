import { useCallback } from "react";
import { STORAGE_KEY_TODOS } from "../constants/appConstants";

export const useLocalStorage = (key = STORAGE_KEY_TODOS) => {
  const getFromLocalStorage = useCallback(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }, [key]);

  const setToLocalStorage = useCallback(
    (value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  return { getFromLocalStorage, setToLocalStorage };
};
