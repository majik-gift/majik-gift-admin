"use client"

import { Box, FormHelperText } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";

const UIOTPInput = ({ onComplete, control = null, name = "otp", errorMessage = "", ...rest }) => {
  // If control is not passed, fallback to the internal useForm control
  const { control: fallbackControl } = useForm();
  const finalControl = control || fallbackControl;

  return (
    <Controller
      name={name}
      control={finalControl}
      render={({ field, fieldState }) => (
        <Box>
          <MuiOtpInput
            length={6}
            {...rest}
            {...field}
            value={field.value || ""}
            onChange={(value) => {
              field.onChange(value); // Update form value in react-hook-form
              if (value.length === 4 && onComplete) {
                onComplete(value); // Trigger onComplete when OTP is complete
              }
            }}
          />
          {(fieldState.invalid || errorMessage) && (
            <FormHelperText sx={{ textAlign: "center" }} error>
              {errorMessage || "OTP invalid"}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default UIOTPInput;

UIOTPInput.propTypes = {
  name: PropTypes.string,
  onComplete: PropTypes.func,
  control: PropTypes.object,
  errorMessage: PropTypes.string,
};
