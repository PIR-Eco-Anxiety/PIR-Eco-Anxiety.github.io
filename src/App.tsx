import { useState } from 'react'
import './App.css'
import { Box, Button, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import ActionTable from './ActionTable'
import { resetDb } from './storage/db'

enum GameMode {
  MULTIMODAL,
  VIRTUAL
}

function GameModeCard({ title, description, onClick }: { title: string, description: string, onClick: () => void }) {
  return (
    <Card variant='outlined'>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant='h3'>{title}</Typography>
          <Typography variant='body2'>{description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

function GameModeSelector({ onClick }: { onClick: (mode: GameMode) => void }) {
  return (
    <Stack spacing={2} direction="row" justifyContent="center">
      <GameModeCard title='Jouer en multimodal' description='Jouer avec un maître du jeu et le plateau et les cartes physiques.' onClick={() => onClick(GameMode.MULTIMODAL)}/>
      <GameModeCard title='Jouer sur ordinateur' description='Jouer avec un maître du jeu virtuel et le plateau et les cartes virtuelles.' onClick={() => onClick(GameMode.VIRTUAL)}/>
    </Stack>
  )
}

function MultimodalGame() {
  const [started, setStarted] = useState(false);

  return (
    <>
      <Typography variant="h2">Multimodal</Typography>
      {
        !started ? (
          <Button onClick={() => {
            resetDb();
            setStarted(true);
          }}>Recommencer</Button>
        ) : (
          <ActionTable/>
        )
      }
    </>
  )
}

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  return (
    <>
      <Box>
        {
          gameMode === null ? (
            <Stack spacing={10} justifyContent="center">
              <Typography variant="h1">Bienvenue</Typography>
              <GameModeSelector onClick={setGameMode}/>
            </Stack>
          ) : (
            gameMode === GameMode.VIRTUAL ? (
              <Typography variant="h2">Pas encore implémenté</Typography>
            ) : (
              <MultimodalGame/>
            )
          )
        }
      </Box>
    </>
  )
}

export default App
