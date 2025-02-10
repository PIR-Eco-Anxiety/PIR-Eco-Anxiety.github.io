import { Box, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";

interface ChoicePromptProps {
  prompt: string;
  options: { name: string, description: string, onChoose?: () => void, link?: string }[];
}

export function ChoicePrompt({ prompt, options }: ChoicePromptProps) {
  return (
    <Box>
      <Stack spacing={5}>
        <Typography variant='h4'>{prompt}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {options.map((option, index) => {
            return (
              <Card key={index} sx={{ margin: 1 }}>
                <CardActionArea onClick={option.onChoose} {...(option.link ? { href: option.link } : {})}>
                  <CardContent>
                    <Typography variant='h5'>{option.name}</Typography>
                    <Typography>{option.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      </Stack>
    </Box>
  );
}