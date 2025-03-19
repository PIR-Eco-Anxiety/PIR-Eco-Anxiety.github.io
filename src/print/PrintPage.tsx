import { Box, BoxProps, createTheme, styled, ThemeProvider } from "@mui/material";

export const PrintPage = styled(Box)<BoxProps>(() => ({
  // 'display': 'none',
  '@media print': {
    'breakAfter': 'page',
    'display': 'block',
    'margin': '2rem',
  },
}));