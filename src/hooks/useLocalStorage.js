import { useCallback } from "react";
import { STORAGE_KEY_TODOS } from "../constants/appConstants";

export const useLocalStorage = () => {
  const getFromLocalStorage = useCallback(() => {
    const item = localStorage.getItem(STORAGE_KEY_TODOS);
    return item ? JSON.parse(item) : null;
  }, []);

  const setToLocalStorage = useCallback((value) => {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(value));
  }, []);

  return { getFromLocalStorage, setToLocalStorage };
};
