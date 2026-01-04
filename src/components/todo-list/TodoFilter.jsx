import { FilteredButton } from "./FilteredButton";

export const TodoFilter = ({ filter, setFilter }) => {
  return (
    <div className="flex justify-center gap-2">
      <FilteredButton
        label="All"
        filter={filter}
        targetFilter="all"
        setFilter={setFilter}
      />
      <FilteredButton
        label="Active"
        filter={filter}
        targetFilter="active"
        setFilter={setFilter}
      />
      <FilteredButton
        label="Completed"
        filter={filter}
        targetFilter="completed"
        setFilter={setFilter}
      />
    </div>
  );
};
