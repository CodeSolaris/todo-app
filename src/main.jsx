import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { ThemeProvider } from "./providers/ThemeProvider";
import { TodoProvider } from "./providers/TodoProvider";
import { OnlineStatusProvider } from "./providers/OnlineStatusProvider";
import { NotificationProvider } from "./providers/NotificationProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <OnlineStatusProvider>
        <ThemeProvider>
          <TodoProvider>
            <App />
          </TodoProvider>
        </ThemeProvider>
      </OnlineStatusProvider>
    </NotificationProvider>
  </StrictMode>
);
