import { useState } from "react";
import { TodoTextInput } from "./TodoTextInput";
import { DeadlineSelector } from "./DeadlineSelector";

export const AddTodo = ({ onAddTodo }) => {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddTodo(text, deadline);
    setText("");
    setDeadline("");
    setShowDeadlineInput(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <TodoTextInput value={text} onChange={(e) => setText(e.target.value)} />
      <DeadlineSelector
        deadline={deadline}
        setDeadline={setDeadline}
        showDeadlineInput={showDeadlineInput}
        setShowDeadlineInput={setShowDeadlineInput}
      />
    </form>
  );
};
