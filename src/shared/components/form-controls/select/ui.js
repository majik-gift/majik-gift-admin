'use client';

import { selectClasses, styled } from '@mui/material';

import { UIInputField } from '../..';
import { conditionalObject } from '@/shared/utilis/utilis';

export const StyledTextFieldSelect = styled(UIInputField, {
  shouldForwardProp: (prop) => prop !== 'fillable' && prop !== 'noOutline',
})(({ theme, fillable, noOutline, minWidth }) => ({
  [`.${selectClasses.select}`]: {
    background: fillable
      ? theme.palette.fillable.main
      : theme.palette.common.white,
    color: theme.palette.text.main,

    minWidth: minWidth || '3rem',
  },

  ...conditionalObject(noOutline, {
    '& fieldset': {
      outline: 'none',
      border: 'none',
    },
  }),
}));
