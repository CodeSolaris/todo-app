import { TodoContext } from "../contexts/TodoContext";
import { useTodoManagement } from "../hooks/useTodoManagement";

export const TodoProvider = ({ children }) => {
  const todoManagement = useTodoManagement();

  return (
    <TodoContext.Provider value={todoManagement}>
      {children}
    </TodoContext.Provider>
  );
};
