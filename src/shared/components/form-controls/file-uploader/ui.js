import { Box, alpha, styled } from '@mui/material';
// import { StyledCard } from 'components/card/ui';

export const StyledCardDropzone = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragActive',
})(({ theme, isDragActive }) => ({
  width: '100%',
  height: '10em',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  // border: `solid 2px ${theme.palette.border.main}`,
  border: `solid 2px "red"`,
  backgroundColor: '#F2F5F7',
  borderStyle: 'dashed',
  borderRadius: '0.5rem',
  transition: '0.2s',

  '&:hover': {
    // borderColor: theme.palette.border.dark,
    borderColor: "gray",
  },

  ...(isDragActive
    ? {
        backgroundColor: alpha(theme.palette.secondary.main, 0.5),
      }
    : {}),
}));
