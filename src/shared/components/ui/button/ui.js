"use client"

import { Button, styled } from '@mui/material';
import { conditionalObject } from '@shared/utilis/utilis';


export const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== 'fillable' && prop !== 'rounded' && prop !== 'btnColor',
})(({ size, theme, fillable, rounded, btnColor = '' }) => ({
  ...conditionalObject(rounded, {
    borderRadius: '2rem',
    paddingLeft: '3rem',
    paddingRight: '3rem',
  }),

  ...conditionalObject(size == 'large', { fontSize: '1rem' }),

  // ...conditionalObject(fillable, {
  //   color: theme.palette.text.main,
  //   backgroundColor: theme.palette.fillable.main,

  //   '&:hover': {
  //     backgroundColor: alpha(theme.palette.fillable.main, 0.6),
  //   },
  // }),
  // ...conditionalObject(btnColor, {
  //   backgroundColor: theme.palette[btnColor]?.main,

  //   '&:hover': {
  //     backgroundColor: btnColor && alpha(theme.palette[btnColor]?.main, 0.6),
  //   },
  // }),
}));
