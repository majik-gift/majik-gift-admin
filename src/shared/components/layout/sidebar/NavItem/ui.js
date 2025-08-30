import { ListItemButton, styled } from '@mui/material';

// Define the styled component
export const ListItemStyled = styled(ListItemButton)(
  ({ theme, level, isItemSelected, hideMenu }) => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    fontSize: '0.8rem',
    borderRadius: `${7}px`,
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color:
      level > 1 && isItemSelected
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
    '&.Mui-selected': {
      color: 'black',
      backgroundColor: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        color: 'black',
      },
    },
  })
);
