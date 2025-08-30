'use client';

import { useState } from 'react';

import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import * as PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';

import { UIInputField } from '..';

const UITimePicker = ({
  name,
  control,
  errorMessage,
  label,
  disabled,
  nativeLabel,
  errors,
  // eslint-disable-next-line no-unused-vars
  hightlightError,
  fullWidth = true, // Ensure fullWidth support
  ...rest
}) => {
  const { control: fallbackControl } = useForm();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control || fallbackControl}
        render={({ field: { value, onChange, ...field } }) => {
          return (
            <TimePicker
              readOnly={disabled}
              inputFormat="HH:mm"
              value={value ? dayjs(value) : null}
              onChange={(newValue) => {
                onChange(newValue ? newValue : '');
              }}
              {...rest}
              slotProps={{
                textField: {
                  error: !!errorMessage || !!errors[field.name],
                  helperText: errorMessage || errors[field.name],
                  fullWidth: true,
                  onBlur: field.onBlur,
                  disabled: field.disabled,
                  name: field.name,
                  label,
                },
              }}
              slots={{
                textField: UIInputField,
              }}
              inputRef={field.ref}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default UITimePicker;

UITimePicker.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  control: PropTypes.object,
  errorMessage: PropTypes.string,
  hightlightError: PropTypes.bool,
  fullWidth: PropTypes.bool, // PropType for full width
};
