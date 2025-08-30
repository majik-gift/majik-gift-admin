import axiosInstance from '@/shared/services/axiosInstance';
import { Autocomplete, TextField, Typography } from '@mui/material';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';

const UIAutocomplete = ({
  control = null,
  name = 'autocomplete',
  label = '',
  url,
  onChange = () => { },
  onInputChange = () => { },
  options = [],
  isLoading = false,
  placeholder = '',
  errorMessage = '',
  errors = {},
  multiple = true,
  onOpen = () => { },
  ...otherProps
}) => {
  const errorMessageToShow = errorMessage || errors[name];
  const isError = !!errorMessageToShow;
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])


  const fetchData = async (value = '') => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get(`${url}&search=${value}`);
      const lightWorkersList = data?.response?.details || [];
      setData(lightWorkersList?.map(item => ({ label: item.full_name || item?.title || item?.label || item?.name, value: item.id })));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  const fetchDataBySearch = debounce((searchValue) => {
    fetchData(searchValue); // Fetch data based on the search value
  }, 500);

  const renderAutocomplete = ({ field: { ref, value = [], ...field } }) => {
    let currentValue = [];
    if (multiple) {
      currentValue = Array.isArray(value) ? value : [];
    } else {
      currentValue = value;
    }

    return (
      <>
        {label && (
          <Typography fontWeight="800" variant="h5">
            {label}
          </Typography>
        )}
        <Autocomplete
          multiple={multiple}
          options={url ? data : options}
          onOpen={url ? () => fetchData('') : onOpen}
          loading={url ? loading : isLoading}
          value={currentValue}
          onChange={(event, newValue) => {
            if (control) {
              console.log('val', newValue);
              field.onChange(newValue)
            } else {
              onChange(newValue);
            }
          }}
          onInputChange={(event, newValue) => {
            if (url) fetchDataBySearch(newValue)
          }}
          getOptionLabel={(option) => option.label || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              error={isError}
              // onChange={(e)=>fetchDataBySearch(e.target.value)}
              helperText={errorMessageToShow}
              inputRef={ref}
              {...otherProps}
            />
          )}
        />
      </>
    );
  };

  return control ? (
    <Controller name={name} control={control} render={renderAutocomplete} />
  ) : (
    renderAutocomplete({ field: { ref: null, value: otherProps.value || [], ...otherProps } })
  );
};

export default UIAutocomplete;

UIAutocomplete.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  errors: PropTypes.object,
  multiple: PropTypes.bool,
};
