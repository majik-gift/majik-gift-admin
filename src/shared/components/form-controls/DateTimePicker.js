'use client';

import { useState } from 'react';
import { Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';

import { UIInputField } from '..';

const UIDateTimePicker = ({
  name,
  control,
  onChange, // Add the onChange prop
  errorMessage,
  label,
  disabled,
  highlightError,
  value: externalValue, // Allow external value for non-react-hook-form usage
  ...rest
}) => {
  const { control: fallbackControl } = useForm(); // Fallback control for optional usage
  const [open, setOpen] = useState(false);

  // If no control prop is provided, use fallback control
  const effectiveControl = control || fallbackControl;

  const handleOpen = () => {
    if (!disabled) setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const labelTypo = label && (
    <Typography fontWeight="800" variant="h5">
      {label}
    </Typography>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={effectiveControl}
        render={({ field: { value, onChange: rhfOnChange, ...field } }) => {
          // Combine the react-hook-form `onChange` with the custom `onChange` prop
          const combinedOnChange = (newValue) => {
            if (rhfOnChange) rhfOnChange(newValue); // Call react-hook-form handler if available
            if (onChange) onChange(newValue); // Call custom onChange handler if provided
          };

          // Handle value: prioritize external value if provided, fallback to RHF value
          const pickerValue = externalValue !== undefined ? externalValue : value;

          return (
            <>
              {labelTypo}
              <DateTimePicker
                open={open}
                onOpen={handleOpen}
                onClose={handleClose}
                disableMaskedInput
                readOnly={disabled}
                value={pickerValue || null}
                onChange={combinedOnChange} // Use combined onChange handler
                error={errorMessage}
                inputFormat="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    helperText: errorMessage,
                    error: Boolean(errorMessage),
                    fullWidth: true,
                  },
                }}
                {...field}
                {...rest}
                renderInput={(params) => (
                  <UIInputField
                    sx={{
                      '& .MuiFormHelperText-root': {
                        marginLeft: 0,
                        color: 'red',
                      },
                    }}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    errorMessage={errorMessage}
                    onClick={handleOpen}
                    {...params}
                    {...rest}
                  />
                )}
              />
            </>
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default UIDateTimePicker;

UIDateTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  onChange: PropTypes.func, // Custom onChange handler
  errorMessage: PropTypes.string,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  highlightError: PropTypes.bool,
  value: PropTypes.any, // Optional external value for controlled usage
};
