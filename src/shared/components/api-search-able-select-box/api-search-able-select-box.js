import axiosInstance from '@/shared/services/axiosInstance';
import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

const ApiSearchableAutocomplete = ({
  label,
  apiEndpoint,
  // value,
  disabled = false,
  searchParam = 'query', // Default query parameter for search
  control = null,
  name = 'autocomplete',
  errorMessage = '',
  errors = {},
  extraParams,
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const errorMessageToShow = errorMessage || errors[name];
  const isError = !!errorMessageToShow;

  // Function to fetch options
  const fetchOptions = async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(apiEndpoint, {
        params: { [searchParam]: search, ...extraParams }, // Add search query to API call
      });
      console.log('🚀 ~ fetchOptions ~ response:', response);
      const data = response?.data?.response?.details || []; // Adjust based on your API response structure
      const formattedOptions = data.map((item) => ({
        label: item.name || item.title, // Adjust based on your API response field names
        id: item.id,
      }));
      setOptions(formattedOptions);
    } catch (err) {
      console.error('Error fetching options:', err);
      setError('Failed to fetch options.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function

  const debouncedFetch = useMemo(() => debounce((search) => fetchOptions(search), 500), []);

  useEffect(() => {
    // Fetch initial data (if required) on mount
    setOptions([]);
    fetchOptions();
    // Cleanup the debounce function on unmount
    return () => debouncedFetch.cancel();
  }, [apiEndpoint]); // Initial fetch only on mount

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    debouncedFetch(event.target.value); // Trigger the debounced function during search input
  };

  const renderAutocomplete = ({ field: { ref, value = [], onChange } }) => {
    return (
      <>
        <Typography fontWeight="800" variant="h5">
          {label}
        </Typography>
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            onChange(newValue);
          }}
          onOpen={() => fetchOptions('')}
          // onInputChange={handleSearchChange}
          options={options}
          loading={loading}
          disabled={disabled}
          getOptionLabel={(option) => option.label}
          getOptionKey={(option) => option.id}
          isOptionEqualToValue={(option, value) => option.id === value}
          renderInput={(params) => (
            <TextField
              {...params}
              // label={label}
              placeholder={label}
              onChange={handleSearchChange}
              error={!!error || isError}
              helperText={error || errorMessageToShow}
              inputRef={ref}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          noOptionsText={
            loading ? (
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgress size={20} />
                <Typography ml={1}>Loading...</Typography>
              </Box>
            ) : (
              'No results found'
            )
          }
        />
      </>
    );
  };

  return <Controller name={name} control={control} render={renderAutocomplete} />;
};

export default ApiSearchableAutocomplete;
