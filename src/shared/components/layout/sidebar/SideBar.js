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
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/auth/auth.slice';
import UIScrollbar from '../../ui/scrollbar';
import { ListItemStyled } from './NavItem/ui';
import SidebarItems from './SidebarItems';
import { HoverCloseDrawer } from './styles';

// Main customer-facing site URL – vendors are sent here on logout so they don't see admin login
const getMainSiteUrl = () => process.env.NEXT_PUBLIC_WEB_APP_URL || '';

export default function UiSidebar({ routes }) {
  const { toggleLoader } = useUI();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const {
    uiState: { isDrawerOpen },
    toggleUIState,
  } = useUI();
  const [loading, setLoading] = useState(false);

  const matches = useMediaQuery(DRAWER_BREAK_POINT);

  const handleLogout = async () => {
    toggleLoader('showLoader');
    const role = user?.role;
    try {
      dispatch(logout());
      removeLocalAccessToken();
      await deleteCookie();
      // Light workers and stall holders go back to main site; admins stay on admin login
      if (role === 'light_worker' || role === 'stall_holder') {
        const mainUrl = getMainSiteUrl();
        if (mainUrl) {
          window.location.href = mainUrl.endsWith('/') ? `${mainUrl}log-in` : `${mainUrl}/log-in`;
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
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
