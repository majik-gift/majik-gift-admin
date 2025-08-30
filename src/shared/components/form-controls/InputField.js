import { forwardRef } from 'react';

import { InputAdornment, TextField, Typography } from '@mui/material';
import * as PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

const UIInputField = (
  {
    variant = 'outlined',
    icon = null,
    startIcon = null,
    control = null,
    label = '',
    nativeLabel = '',
    errorMessage = '',
    name = 'fallback',
    errors = {},
    InputProps = {},
    ...otherProps
  },
  ref
) => {
  const errorMessageToShow = errorMessage || errors[name];
  const isError = !!errorMessageToShow;

  const commonTextProps = {
    size: 'medium',
    variant,
    fullWidth: true,
    error: isError,
    helperText: errorMessageToShow,
    InputProps: {
      ...(startIcon
        ? {
          startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment>,
        }
        : {}),
      ...(icon
        ? {
          endAdornment: <InputAdornment position="end">{icon}</InputAdornment>,
        }
        : {}),
      ...InputProps,
    },
    // inputProps: { min: 4, max: 10 },
  };

  const labelTypo = label && (
    <Typography fontWeight="800" variant="h5">
      {label}
    </Typography>
  );

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { ref, value = '', ...field } }) => {


          return (
            <>
              {labelTypo}
              <TextField
                label={nativeLabel}
                {...commonTextProps}
                inputRef={ref}
                value={otherProps.value || value}
                {...field}
                {...otherProps}
              />
            </>
          );
        }}
      />
    );
  }

  return (
    <>
      {labelTypo}
      <TextField ref={ref} {...commonTextProps} {...otherProps} label={nativeLabel} />
    </>
  );
};

export default forwardRef(UIInputField);

UIInputField.propTypes = {
  variant: PropTypes.string,
  icon: PropTypes.any,
  startIcon: PropTypes.any,
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  errors: PropTypes.object,
  errorMessage: PropTypes.string,
  nativeLabel: PropTypes.string,
  InputProps: PropTypes.object,
};
