import { Checkbox, FormControlLabel } from "@mui/material";
import * as PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";

const UICheckbox = ({ name = "", control = null, ...otherProps }) => {
  const { control: fallbackControl } = useForm();

  return (
    <Controller
      name={name}
      control={control || fallbackControl}
      render={({ field: { onChange, value, ...field } }) => {
        return (
          <>
            <FormControlLabel onChange={(e) => onChange(e.target.checked)} control={<Checkbox defaultChecked={value} {...field} />} {...otherProps} />
          </>
        );
      }}
    />
  );
};

export default UICheckbox;

UICheckbox.propTypes = {
  control: PropTypes.object,
  name: PropTypes.object,
};
