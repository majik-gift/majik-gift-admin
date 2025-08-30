import { Controller, useForm } from "react-hook-form";

import * as PropTypes from "prop-types";

import { Switch } from "@mui/material";

const UISwitch = ({ name = "switch", control = null, size = "small", ...otherProps }) => {
  const { control: fallbackControl } = useForm();

  return (
    <Controller
      name={name}
      control={control || fallbackControl}
      render={({ field: { onChange, ...field } }) => {
        return <Switch onChange={(e, checked) => onChange(checked)} size={size} {...field} {...otherProps} />;
      }}
    />
  );
};

export default UISwitch;

UISwitch.propTypes = {
  name: PropTypes.string,
  size: PropTypes.string,
  control: PropTypes.object,
};
