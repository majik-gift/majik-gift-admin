import { Search } from "@mui/icons-material";
import debounce from "lodash/debounce"; // Import debounce from Lodash
import { useMemo } from "react";
import { UIInputField } from "..";

const UISearchField = ({ onChange, delay = 500, value: initialValue, ...otherProps }) => {
  // Create a debounced version of the onChange handler
  const debouncedOnChange = useMemo(() => debounce(onChange, delay), [onChange, delay]);

  const handleChange = (e) => {
    debouncedOnChange(e); // Call debounced version of onChange
  };

  return (
    <UIInputField
      icon={<Search />}
      autoComplete="off"
      fullWidth={false}
      placeholder="Search"
      // size="small"
      sx={{ marginTop: 0, marginBottom: 0 }}
      //   value={initialValue}
      onChange={handleChange} // Trigger debounced handleChange
      {...otherProps}
    />
  );
};

export default UISearchField;
