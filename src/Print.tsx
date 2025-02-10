import { Box, Button, styled, Typography } from "@mui/material";
import { BoxProps } from "@mui/material/Box";
import { Print as PrintIcon } from "@mui/icons-material";

const PrintPage = styled(Box)<BoxProps>(() => ({
  'display': 'none',
  '@media print': {
    'breakAfter': 'page',
    'display': 'block',
  },
}))

export function Print() {

  return (
    <>
      <PrintPage>
        <Typography variant='h4'>Impression</Typography>
      </PrintPage>
      <PrintPage>
        <Typography variant='h4'>Impression</Typography>
      </PrintPage>
      <Box displayPrint='none'>
        <Button
          variant="contained"
          onClick={window.print}
          startIcon={<PrintIcon />}
        >
          Imprimer
        </Button>
      </Box>
    </>
  )
}