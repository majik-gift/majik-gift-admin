import { createTheme, responsiveFontSizes } from '@mui/material';

const typography = {
  fontFamily: ['Lato', 'Libre Bodoni'].join(','),
  h1: {
    fontWeight: 600,
    fontSize: '2.25rem',
    lineHeight: '2.75rem',
  },
  h2: {
    fontWeight: 600,
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: '1.75rem',
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.3125rem',
    lineHeight: '1.6rem',
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: '1.6rem',
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: '1.2rem',
  },
  button: {
    textTransform: 'capitalize',
    fontWeight: 400,
  },
  body1: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: '1.334rem',
  },
  body2: {
    fontSize: '0.75rem',
    letterSpacing: '0rem',
    fontWeight: 400,
    lineHeight: '1rem',
  },
  subtitle1: {
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 400,
  },
};

const shadows = [
  'none',
  '0px 2px 3px rgba(0,0,0,0.10)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 2px 2px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 8px -2px rgba(0,0,0,0.25)',
  '0 9px 17.5px rgb(0,0,0,0.05)',
  'rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 7px 12px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 6px 16px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 7px 16px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 8px 18px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 9px 18px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 10px 20px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 11px 20px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 12px 22px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 13px 22px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 14px 24px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 16px 28px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 18px 30px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 20px 32px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 22px 34px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 24px 36px -8px rgba(0,0,0,0.25)',
];

const baselightTheme = {
  direction: 'ltr',
  palette: {
    primary: {
      main: '#D3AFC9', // Original color
      light: '#F0DDE6', // Lighter version
      dark: '#B288A4', // Darker version
    },
    secondary: {
      main: `#9C90C2`,
    },
    success: {
      main: '#13DEB9',
      light: '#E6FFFA',
      dark: '#02b3a9',
      contrastText: '#ffffff',
    },
    info: {
      main: '#539BFF',
      light: '#EBF3FE',
      dark: '#1682d4',
      contrastText: '#ffffff',
    },
    // error: {
    //     main: '#FA896B',
    //     light: '#FDEDE8',
    //     dark: '#f3704d',
    //     contrastText: '#ffffff',
    // },
    warning: {
      main: '#FFAE1F',
      light: '#FEF5E5',
      dark: '#ae8e59',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#EBF3FE',
      A100: '#6610f2',
      A200: '#557fb9',
    },

    text: {
      primary: '#000000', // Black for primary text (to match the main primary color)
      secondary: '#4D4D4D', // Slightly lighter grey (to match the light primary color)
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: '#f6f9fc',
    },
    // divider: '#e5eaef',
    background: {
      default: '#ffffff',
    },
  },
};

let theme = createTheme({
  // typography: typography,
  shadows,
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
  ...baselightTheme,
});
theme = responsiveFontSizes(theme);
export default theme;
