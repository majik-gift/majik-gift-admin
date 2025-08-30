'use client';

import { Stack } from '@mui/material';
import Image from 'next/image';

import { BrandLogo } from '@/assets';

const UISplash = () => {
  return (
    <Stack
      sx={{ minHeight: '100vh', userSelect: 'none' }}
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <Image
        src={BrandLogo}
        style={{ width: 250, height: 250, userSelect: 'none' }}
        alt="Logo UISplash Center"
        className="image-center"
        width="0"
        height="0"
        draggable="false" // Disable dragging
      />
    </Stack>
  );
};

export default UISplash;
