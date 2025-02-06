import { Box, Button, Card, CardActions, CardContent, Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { Action, ActionCondition } from "./game/definitions";
import { game } from "./game/definitions";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./storage/db";
import { useEffect, useState } from "react";
import { ActionCompletion } from "./storage/definitions";

function CardConditionList({ conditions, onCheck }: { conditions: ActionCondition[], onCheck: (allChecked: boolean) => void }) {
  const [checked, setChecked] = useState(conditions.map(() => false));
  const handleToggle = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
    onCheck(newChecked.every(c => c));
  }

  return (
    <List dense>
      { conditions.map(
        (condition, i) => {
          return (
            <ListItem key={i} disablePadding>
              <ListItemButton role={undefined} onClick={() => {handleToggle(i)}} >
                <ListItemIcon>
                  <Checkbox checked={checked[i]} disableRipple/>
                </ListItemIcon>
                <ListItemText primary={condition.description} />
              </ListItemButton>
            </ListItem>
          );
        }
      ) }
    </List>
  );
}

function ActionCard({ action, completed, onComplete: callback }: { action: Action, completed: boolean, onComplete: (action: Action) => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <Card variant='outlined'>
      <CardContent>
        <Box>
          <Typography variant='h5'>{action.name}</Typography>
          <Typography variant='body2' sx={{fontStyle: "italic"}}>{action.description}</Typography>
        </Box>
        <Divider />
        <Box>
          <Typography variant='h6'>Conditions: </Typography>
          <CardConditionList conditions={action.conditions} onCheck={setChecked}/>
        </Box>
      </CardContent>
      <CardActions>
        { !completed && <Button disabled={!checked} onClick={() => callback(action)}>Faire l'action</Button> }
      </CardActions>
    </Card>
  );
}

function ActionList({ actions, completed, onComplete: callback }: { actions: Action[], completed: boolean, onComplete: (action: Action) => void }) {
  return (
    <Stack spacing={2}>
      { actions.map(
        (action, i) => {
          return <ActionCard 
            key={i}
            action={action}
            completed={completed}
            onComplete={callback}
          />
        }
      ) }
    </Stack>
  );
}


export default function ActionTable() {
  const actionCompletion = useLiveQuery(() => db.actionCompletion.toArray());
  const mapCompletionsToActions = (completion: ActionCompletion[]): Action[] => {
    return completion.map(c => game.actions.find(a => a.id === c.actionId) || {id: 0, name: "Action inconnue", description: "Un problème est survenu", points: 0, conditions: []});
  }

  const completeAction = (action: Action) => {
    const completion = actionCompletion?.find(c => c.actionId === action.id);
    if (completion) {
      db.actionCompletion.update(completion.actionId, {completed: true});
    }
  }

  return (
    <Stack direction="row" spacing={5}>
      <Stack spacing={2}>
        <Typography variant="h5">Actions restantes</Typography>
        <ActionList actions={mapCompletionsToActions(actionCompletion?.filter(c => !c.completed) || [])} completed={false} onComplete={completeAction}/>
      </Stack>
      <Stack spacing={2}>
        <Typography variant="h5">Actions réalisées</Typography>
        <ActionList actions={mapCompletionsToActions(actionCompletion?.filter(c => c.completed) || [])} completed={true} onComplete={() => alert("Pas normal")}/>
      </Stack>
    </Stack>
  );
}