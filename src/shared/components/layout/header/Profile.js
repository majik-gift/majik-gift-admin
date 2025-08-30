'use client';

import { useState } from 'react';

import { Person2 } from '@mui/icons-material';
import { Avatar, Box, Divider, IconButton, Menu, Typography, MenuItem } from '@mui/material';
import { Stack } from '@mui/system';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import UIScrollbar from '../../ui/scrollbar';
import { usePathname } from 'next/navigation';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const basePath = pathname.split('/')[1];

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={`${user?.profile_image}`}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <Link href={`/${basePath}/user-profile/${user?.id}/update`}>
          <MenuItem onClick={handleClose2}>Profile </MenuItem>
        </Link>
        <Link href={`/${basePath}/user-profile/${user?.id}/change-password`}>
          <MenuItem onClick={handleClose2}>Change Password</MenuItem>
        </Link>
        {/* <UIScrollbar sx={{ height: '100%', maxHeight: '85vh' }}> */}
        {/* <Box p={3}> */}
        {/* <Typography variant="h5">User Profile</Typography>
            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar sx={{ width: 40, height: 40 }}>{user?.first_name?.[0]}</Avatar>
              <Box>
                <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                  {user?.first_name + ' ' + user?.last_name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            {profile.map((profile) => (
              <Box key={profile.title}>
                <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
                  <Link href={profile.href}>
                    <Stack direction="row" spacing={2}>
                      <Box
                        width="45px"
                        height="45px"
                        bgcolor="secondary.light"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: 0,
                          }}
                        >
                          <Person2 />
                        </Avatar>
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          noWrap
                          sx={{
                            width: '240px',
                          }}
                        >
                          {profile.title}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          sx={{
                            width: '240px',
                          }}
                          noWrap
                        >
                          {profile.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </Link>
                </Box>
              </Box>
            ))} */}
        {/* </Box> */}
        {/* </UIScrollbar> */}
      </Menu>
    </Box>
  );
};

export default Profile;

const profile = [
  {
    href: '/user-profile',
    title: 'My Profile',
    subtitle: 'Account Settings',
    icon: <></>,
  },
];
