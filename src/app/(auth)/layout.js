'use client';

import { Box, Card, Stack } from '@mui/material';
import Image from 'next/image';

import { BrandLogo } from '@/assets';

export default function AuthLayout({ children }) {
  return (
    <Box sx={Styles.box}>
      <Card elevation={12} sx={Styles.card}>
        <Stack justifyContent="center" alignItems="center" height={1} spacing={2}>
          <Image src={BrandLogo} alt="Logo" style={Styles.logo} priority />
          {children}
        </Stack>
      </Card>
    </Box>
  );
}

const Styles = {
  box: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    overflow: 'auto',
    p: 5,
    height: { xs: '100%', sm: 'auto' },
    width: { xs: '100%', sm: '440px' },
  },
  logo: {
    width: '150px', // Adjust as per your design
    height: 'auto',
  },
  greeting: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
};
