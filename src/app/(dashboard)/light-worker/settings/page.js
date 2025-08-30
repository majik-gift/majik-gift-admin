'use client';

import { Box, Grid2 } from '@mui/material';

import { ConnectZoomBtn, UICard } from '@/shared/components';
import { kebabCase } from 'lodash';
import { useSelector } from 'react-redux';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Box component="form" sx={{ width: '100%' }}>
        <UICard heading="Settings" backButton>
          <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 12 }}>
              <ConnectZoomBtn
                redirectUri={window.location.origin + `/${kebabCase(user?.role)}/settings`}
                normalBtn={false}
              />
            </Grid2>
          </Grid2>
        </UICard>
      </Box>
    </>
  );
};

export default Settings;
