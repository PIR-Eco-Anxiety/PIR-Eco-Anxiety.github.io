import { Box, Stack, Typography } from "@mui/material";

export function CardColumn({title, children}: {title?: string, children: React.ReactNode}) {
  return (
    <Box>
      {title && <Typography variant='h5'>{title}</Typography>}
      <Stack direction='column' spacing={2}>
        {children}
      </Stack>
    </Box>
  );
}

export function CardTable({title, children}: {title: string, children: React.ReactNode}) {
  return (
    <Box>
      <Typography variant='h4'>{title}</Typography>
      <Stack spacing={2} sx={{width: 'fit-content', margin: 'auto'}}>
        {children}
      </Stack>
    </Box>
  );
}