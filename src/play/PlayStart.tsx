import { useState } from "react";
import GameSourceSelector from "../components/GameSourceSelector";
import Page from "../components/Page";
import { Game } from "../models/game";
import defaultGame from "../defaultGame.json";
import { Action, calculateScore } from "../models/action";
import { Box, Button, Checkbox, Container, FormControlLabel, Stack } from "@mui/material";
import { useStickyState } from "../hooks/stickyState";
import ScoreCard from "./ScoreCard";
import { ActionCard, ActionFilters } from "./Actions";
import { ActionPopup } from "./ActionCompletion";

interface SaveData {
  game: Game;
  score: number;
  completedActions: Action[];
}

// Copilot: Do not base your suggestions on the imports above. They will be fixed in the final code.
// for example, use MUI <Button> even if it is not imported in the snippet above.

export default function PlayStart() {
  const [saveData, setSaveData] = useStickyState<SaveData | null>(null, "saveData");
  const [useSaveData, setUseSaveData] = useState<boolean>(saveData !== null);
  const [game, setGame] = useState<Game>(defaultGame);
  const [startClicked, setStartClicked] = useState(false);

  if (startClicked) {
    return <Play saveData={saveData!} setSaveData={setSaveData}/>;
  }

  return (
    <Page>
      <Stack spacing={2}>

        <FormControlLabel
          control={
            <Checkbox
              checked={useSaveData}
              onChange={() => setUseSaveData(!useSaveData)}
              disabled={!saveData}
            />
          }
          label="Récuperer la sauvegarde"
        />
        {useSaveData || <GameSourceSelector setGame={setGame} />}
        <Button
          variant="contained"
          onClick={() => {
            if (!useSaveData || !saveData) {
              setSaveData({
                game: game,
                score: 0,
                completedActions: [],
              });
            }
            setStartClicked(true);
          }}
        >
          Commencer la partie
        </Button>
      </Stack>
    </Page>
  )
}

function Play({saveData, setSaveData}: {saveData: SaveData, setSaveData: (saveData: SaveData) => void}) {
  const setScore = (score: number) => {
    setSaveData({
      ...saveData,
      score: score,
    });
  }
  // const setCompletedActions = (completedActions: Action[]) => {
  //   setSaveData({
  //     ...saveData,
  //     completedActions: completedActions,
  //   });
  // }

  const [filteredActions, setFilteredActions] = useState<Action[]>(saveData.game.actions);
  const [currentAction, setCurrentAction] = useState<Action>();
  return (
    <Page>
      <Container maxWidth="md">
        <ScoreCard score={saveData.score} />
        <ActionFilters game={saveData.game} setFilteredActions={setFilteredActions} />
        <ActionPopup action={currentAction} onCancel={() => setCurrentAction(undefined)} onQuestionAnswered={(correct) => {
          setScore(saveData.score + calculateScore(currentAction!, correct));
          setCurrentAction(undefined);
        }} />
        <Box marginTop={4} display='flex' flexWrap="wrap" justifyContent="center" gap={2}>
          {filteredActions.map(action => (
            <ActionCard
              key={action.id}
              game={saveData.game}
              action={action}
              onCompleteAction={() => {
                action.bonusQuestion ? setCurrentAction(action) : setScore(saveData.score + action.points);
              }}
            />
          ))}
        </Box>
      </Container>
      
    </Page>
  )
}