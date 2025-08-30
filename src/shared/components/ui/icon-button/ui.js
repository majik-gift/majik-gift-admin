"use client"

import { IconButton, alpha, styled } from '@mui/material';

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'fillable',
})(({ theme, fillable, bg }) => {
  const black = theme.palette.common.black;
  const fillableBg = alpha(black, 0.15);

  const background = theme.palette[bg]?.main || bg;

  return {
    ...(fillable
      ? {
          background: fillableBg,

          '&:hover': { background: fillableBg },
        }
      : {}),

    ...(bg
      ? {
          background,
          '&:hover': { background },
        }
      : {}),
  };
});
