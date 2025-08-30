import { styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  // border: "none",

  // ".MuiDataGrid-virtualScroller": {
  //   fontSize: "0.9rem",
  // },

  // ".MuiDataGrid-overlayWrapper": {
  //   fontSize: "1.5rem",
  //   fontWeight: 700,
  // },

  // "& .MuiDataGrid-columnSeparator--sideRight": {
  //   opacity: "1 !important",
  // },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none !important', // Hides column separators
  },

  '& .MuiDataGrid-columnHeaders': {
    // padding: '0 1rem',
    backgroundColor: theme.palette.secondary.main,
    fontSize: 17,
    '& svg': {
      color: 'black',
    },

    '&:focus, &:focus-visible, &:focus-within': {
      outline: 'none !important',
      opacity: 1,
    },
  },

  '& .MuiDataGrid-columnHeader': {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '0 !important',
    borderBottom: '0 !important',
  },
  '& .MuiDataGrid-sortIcon': {
    display: 'none !important', // Completely hides sorting arrows
  },

  '& .MuiDataGrid-scrollbarFiller': {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '0 !important',
    borderBottom: '0 !important',
  },

  '& .MuiDataGrid-cell': {
    '&:focus, &:focus-visible, &:focus-within': {
      outline: 'none !important',
      outlineOffset: '0',
    },
    fontSize: 16,
  },

  // "& .MuiDataGrid-footerContainer": { border: "none", padding: 0 },
}));
