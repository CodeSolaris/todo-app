import { useContext } from "react";
import { OnlineStatusContext } from "../contexts/OnlineStatusContext";

export const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext);
  if (!context) {
    throw new Error(
      "useOnlineStatus must be used within an OnlineStatusProvider"
    );
  }
  return context;
};
