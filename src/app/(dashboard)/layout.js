'use client';

import { Box, Container, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';

import { UiHeader, UiSidebar } from '@/shared/components';
import { DRAWER_BREAK_POINT } from '@/shared/constant';
import { sideBarRoutes } from '../routes';

const DashboardLayout = ({ children }) => {
  const matches = useMediaQuery(DRAWER_BREAK_POINT);
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {/* {((user?.stripeConnectStatus == "connect_required") || (user?.stripeConnectStatus == "under_review" )) ? (
        <>{children}</>
      ) : ( */}
      <>
        <UiSidebar routes={sideBarRoutes[user?.role]} />
        <Box sx={styles.mainBoxSx(matches)}>
          <UiHeader />
          <Container sx={styles.containerSx}>
            <Box component="main">{children}</Box>
          </Container>
        </Box>
      </>
      {/* )} */}
    </>
  );
};

export default DashboardLayout;

const styles = {
  mainBoxSx: (matches) => (matches ? { width: 'calc(100% - 260px)', ml: '260px' } : { py: '20px' }),
  containerSx: { maxWidth: '1440px !important', px: { lg: '27px' } },
};
