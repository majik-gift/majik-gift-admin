'use client';

import { BrandLogo } from '@/assets';
import { DRAWER_BREAK_POINT } from '@/shared/constant';
import { useUI } from '@/shared/context/UIContext';
import { removeLocalAccessToken } from '@/shared/helpers/authHelpers';
import { deleteCookie } from '@/shared/helpers/cookies';
import { Logout } from '@mui/icons-material';
import { Box, ListItemIcon, ListItemText, Stack, useMediaQuery } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import UIScrollbar from '../../ui/scrollbar';
import { ListItemStyled } from './NavItem/ui';
import SidebarItems from './SidebarItems';
import { HoverCloseDrawer } from './styles';

export default function UiSidebar({ routes }) {
  const { toggleLoader } = useUI();
  const router = useRouter();
  const {
    uiState: { isDrawerOpen },
    toggleUIState,
  } = useUI();
  const [loading, setLoading] = useState(false);

  const matches = useMediaQuery(DRAWER_BREAK_POINT);

  const handleLogout = async () => {
    toggleLoader('showLoader');
    try {
      removeLocalAccessToken();
      await deleteCookie();
      router.push('/login');
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoader('hideLoader');
    }
  };

  const renderLogo = () => {
    return (
      <Stack justifyContent="center" alignItems="center" py={2}>
        <Image src={BrandLogo} width={90} alt="logo" draggable={false} />
      </Stack>
    );
  };

  const renderLogoutBtn = () => {
    return (
      <Box sx={{ px: 3 }}>
        <ListItemStyled onClick={handleLogout} loading={loading} disabled={loading}>
          <ListItemIcon
            sx={{
              minWidth: '36px',
              p: '3px 0',
            }}
          >
            <Logout />
          </ListItemIcon>
          <ListItemText>Log out</ListItemText>
        </ListItemStyled>
      </Box>
    );
  };

  return (
    <>
      {matches ? (
        <HoverCloseDrawer
          variant={'permanent'}
          open={true}
          PaperProps={{
            elevation: 6,
          }}
        >
          {renderLogo()}
          <UIScrollbar sx={{ height: 'calc(100% - 230px)' }}>
            <SidebarItems menuitems={routes} />
          </UIScrollbar>
          {renderLogoutBtn()}
        </HoverCloseDrawer>
      ) : (
        <MuiDrawer
          variant="temporary"
          open={isDrawerOpen}
          PaperProps={{
            sx: {
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.shortest,
                }),
              width: 260,
              boxSizing: 'border-box',
            },
          }}
          onClose={() => toggleUIState('isDrawerOpen')}
        >
          <Stack>
            {renderLogo()}
            <SidebarItems menuitems={routes} />
            {renderLogoutBtn()}
          </Stack>
        </MuiDrawer>
      )}
    </>
  );
}
