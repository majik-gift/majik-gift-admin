import { CircularProgress, Stack } from '@mui/material';
import React from 'react';

const loading = () => {
  return (
    <Stack justifyContent="center" alignItems="center">
      <CircularProgress size={100} />
    </Stack>
  );
};

export default loading;
