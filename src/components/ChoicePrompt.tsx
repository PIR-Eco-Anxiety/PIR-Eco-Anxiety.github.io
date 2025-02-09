import { Box, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { useState } from "react";

interface ChoicePromptProps {
  prompt: string;
  options: { name: string, description: string, onChoose?: () => void, link?: string }[];
}

export function ChoicePrompt({ prompt, options }: ChoicePromptProps) {
  return (
    <Box>
      <Stack spacing={5}>
        <Typography variant='h4'>{prompt}</Typography>
        <Stack direction='row' spacing={2}>
          {options.map((option, index) => {
            return (
              <Card>
                <CardActionArea onClick={option.onChoose} {...(option.link ? { href: option.link } : {})}>
                  <CardContent>
                    <Typography variant='h5'>{option.name}</Typography>
                    <Typography>{option.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}