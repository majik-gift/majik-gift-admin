import { Radio, FormControlLabel, RadioGroup } from "@mui/material";
import * as PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";

const UIRadio = ({ name = "", control = null, options = [], ...otherProps }) => {
  const { control: fallbackControl } = useForm();

  return (
    <Controller
      name={name}
      control={control || fallbackControl}
      render={({ field: { onChange, value } }) => (
        <RadioGroup
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...otherProps}
          row={true}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      )}
    />
  );
};

export default UIRadio;

UIRadio.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
