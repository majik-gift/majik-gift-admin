'use client';

import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Stack, useMediaQuery } from '@mui/material';

import { DRAWER_BREAK_POINT } from '@/shared/constant';
import { Notifications } from '@mui/icons-material';
import { kebabCase } from 'lodash';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Profile from './Profile';
import { AppBarStyled, ToolbarStyled } from './ui';
import { useUI } from '@/shared/context/UIContext';

const UiHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const { toggleUIState } = useUI();
  const matches = useMediaQuery(DRAWER_BREAK_POINT);

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled
        sx={{ display: 'flex', justifyContent: matches ? 'flex-end' : 'space-between' }}
      >
        {!matches && (
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => toggleUIState('isDrawerOpen')}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Stack direction="row">
          <IconButton
            size="large"
            color="inherit"
            LinkComponent={Link}
            href={`/${kebabCase(user?.role)}/notifications`}
          >
            <Notifications />
          </IconButton>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default UiHeader;
