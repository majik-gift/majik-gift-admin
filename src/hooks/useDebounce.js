import { useDebounce } from "@/hooks/useDebounce"; // Your debounce hook
import { UIInputField } from "@/shared/components";
import { Search } from "@mui/icons-material";
import { useState } from "react";

const UISearchField = ({ onChange, delay = 500, value: initialValue, ...otherProps }) => {
  const [value, setValue] = useState(initialValue); // Local state for input value

  // Debounce the value with the provided callback
  useDebounce(value, delay, (debouncedValue) => {
    if (onChange) {
      onChange({ target: { value: debouncedValue } });
    }
  });

  const handleChange = (e) => {
    setValue(e.target.value); // Update the local state on every change
  };

  return (
    <UIInputField
      icon={<Search />}
      autoComplete="off"
      fullWidth={false}
      placeholder="Search"
      size="small"
      sx={{ marginTop: 0, marginBottom: 0 }}
      value={value}
      onChange={handleChange} // Update local value on input change
      {...otherProps}
    />
  );
};

export default UISearchField;
