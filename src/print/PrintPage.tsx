import { Box, BoxProps, styled } from "@mui/material";

export const PrintPage = styled(Box)<BoxProps>(() => ({
  'display': 'none',
  '@media print': {
    'breakAfter': 'page',
    'display': 'block',
    'margin': '1rem',
  },
}));