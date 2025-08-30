'use client';

import { useState } from 'react';

import { Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';

import { UIInputField } from '..';

const UIDatePicker = ({
  name,
  control,
  errorMessage,
  label,
  disabled,
  // eslint-disable-next-line no-unused-vars
  highlightError,
  ...rest
}) => {
  const { control: fallblckControl } = useForm();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
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
        control={control || fallblckControl}
        render={({ field: { value, ...field } }) => {
          return (
            <>
              {labelTypo}
              <DatePicker
                open={open}
                // disableOpenPicker
                disableMaskedInput
                disablePast
                onOpen={handleOpen}
                readOnly={disabled}
                error={errorMessage}
                inputFormat="DD/MM/YYYY"
                onClose={() => setOpen(false)}
                value={value != null ? value : null}
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
                    errorMessage="ssssss"
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

export default UIDatePicker;

UIDatePicker.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  control: PropTypes.object,
  errorMessage: PropTypes.string,
  highlightError: PropTypes.bool,
};
