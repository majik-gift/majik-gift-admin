import { Box, CircularProgress, MenuItem, Typography } from '@mui/material';
import * as PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import { StyledTextFieldSelect } from './ui';

const UISelect = ({
  fillable,
  isLoading = false,
  label = '',
  options = [],
  minWidth = '3rem',
  showEmptyOption = false,
  control = null,
  name = 'select',
  errorMessage = '',
  errors = {},
  fullWidth = false,
  ...otherProps
}) => {
  const newOptions = showEmptyOption ? [{ label: 'All', value: 'all' }, ...options] : options;

  const errorMessageToShow = errorMessage || errors[name];
  const isError = !!errorMessageToShow;

  const renderSelectField = ({ field: { ref, value = '', ...field } }) => (
    <>
      {label && (
        <Typography fontWeight="800" variant="h5">
          {label}
        </Typography>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" width={minWidth} p="1rem">
          <CircularProgress size="1.3rem" />
        </Box>
      ) : (
        <StyledTextFieldSelect
          fillable={fillable}
          fullWidth={fullWidth}
          select
          minWidth={minWidth}
          error={isError}
          helperText={errorMessageToShow}
          inputRef={ref}
          value={value}
          {...field}
          {...otherProps}
        >
          {options?.length ? (
            newOptions?.map((op) => (
              <MenuItem key={op.value} value={op.value}>
                {op.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Options</MenuItem>
          )}
        </StyledTextFieldSelect>
      )}
    </>
  );

  return control ? (
    <Controller name={name} control={control} render={renderSelectField} />
  ) : (
    renderSelectField({
      field: { ref: null, value: otherProps.value || '', ...otherProps },
    })
  );
};

export default UISelect;

UISelect.propTypes = {
  fillable: PropTypes.bool,
  options: PropTypes.array,
  label: PropTypes.string,
  isLoading: PropTypes.bool,
  minWidth: PropTypes.string,
  showEmptyOption: PropTypes.bool,
  control: PropTypes.object,
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  errors: PropTypes.object,
};
