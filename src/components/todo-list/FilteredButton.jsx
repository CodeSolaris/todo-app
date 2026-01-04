import { Button } from "../ui/Button";

export const FilteredButton = ({ label, filter, targetFilter, setFilter }) => (
  <Button
    onClick={() => setFilter(targetFilter)}
    variant={filter === targetFilter ? "primary" : "secondary"}
    className="transition-all duration-300"
  >
    {label}
  </Button>
);
