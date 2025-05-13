import { Accordion, AccordionDetails, AccordionSummary, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { RefSelector, NewButton, DeleteButton } from "./Common";
import { Action, ActionType, convertAction, getActionType, GroupAction, PersonalAction, SharedAction } from "../models/action";
import { Game } from "../models/game";
import { Role } from "../models/role";
import { Location } from "../models/map";
import { Event } from "../models/event";
import { BonusQuestionType, convertBonusQuestion, getBonusQuestionType, MultipleChoiceQuestion, OpenQuestion, SimpleQuestion } from "../models/questions";
import React from "react";

export function CreationCard({name, children, divider}: {name: string, children: React.ReactNode, divider: boolean}) {
  return (
    <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2} divider={divider && <Divider/>}>
          {children}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

CreationCard.defaultProps = {
  divider: false
}

export function RoleCreationCard({role, setRole}: {role: Role, setRole: (role: Role) => void}) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole({...role, [event.target.name]: event.target.value});
  }
  return (
    <CreationCard name={role.name}>
      <TextField name="name" label="Nom" value={role.name} variant="outlined" onChange={onChange}/>
      <TextField name="description" label="Description" value={role.description} variant="outlined" multiline onChange={onChange}/>
    </CreationCard>
  );
}

export function LocationCreationCard({location, setLocation}: {location: Location, setLocation: (location: Location) => void}) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({...location, [event.target.name]: event.target.value});
  }
  return (
    <CreationCard name={location.name}>
      <TextField name="name" label="Nom" value={location.name} variant="outlined" onChange={onChange}/>
      <TextField name="description" label="Description" value={location.description} variant="outlined" multiline onChange={onChange}/>
    </CreationCard>
  );
}

export function EventCreationCard({event, setEvent}: {event: Event, setEvent: (event: Event) => void}) {
  const onChange = (event2: React.ChangeEvent<HTMLInputElement>) => {
    setEvent({...event, [event2.target.name]: event2.target.value})
  }
  return (
    <CreationCard name={event.name}>
      <TextField name="name" label="Nom" value={event.name} variant="outlined" onChange={onChange}/>
      <TextField name="description" label="Description" value={event.description} variant="outlined" multiline onChange={onChange}/>
    </CreationCard>
  );
}

function ActionBasicsSelector({action, setAction}: {action: Action, setAction: (action: Action) => void}) {

  return (
    <>
      <Stack spacing={2}>
        <TextField name="name" label="Nom" value={action.name} variant="outlined" onChange={
          (e) => setAction({...action, name: e.target.value})
        }/>
        <TextField name="points" label="Points" value={action.points} variant="outlined" type="number" onChange={
          (e) => setAction({...action, points: parseInt(e.target.value)})
        }/>
      </Stack>
      <TextField name="description" label="Description" value={action.description} variant="outlined" multiline onChange={
        (e) => setAction({...action, description: e.target.value})
      }/>
    </>
  );
}


function ActionTypeSelector({action, setAction}: {action: Action, setAction: (action: Action) => void}) {
  // First select action type (shared, personal, group)
  // For shared, simply select player number
  // For personal, select role and location using RefSelectors
  // For group, select multiple roles and location using RefSelectors
  const actionType = getActionType(action);

  return (
    <>
      <Typography variant="h5">Type</Typography>
      <FormControl>
        <InputLabel>Type</InputLabel>
        <Select
          value={actionType}
          variant="outlined"
          onChange={(e) => setAction(convertAction(action, e.target.value as ActionType))}
        >
          <MenuItem value={ActionType.SHARED}>Partagée</MenuItem>
          <MenuItem value={ActionType.PERSONAL}>Personnelle</MenuItem>
          <MenuItem value={ActionType.GROUP}>Groupe</MenuItem>
        </Select>
      </FormControl>        
    </>
  )
}

function ActionConditionSelector({game, action, setAction}: {game: Game, action: Action, setAction: (action: Action) => void}) {
  const actionType = getActionType(action);
  switch (actionType) {
    case ActionType.SHARED:
      // Number selector and location selector
      const sharedAction = action as SharedAction;
      return (
        <>
          <TextField
            name="playerNumber"
            label="Nombre de joueurs"
            value={sharedAction.playerNumber}
            variant="outlined"
            type="number"
            onChange={
            (e) => setAction({...action, playerNumber: parseInt(e.target.value)})
          }/>
          <RefSelector
            label="Lieu"
            refs={game.map.locations}
            selectedRefId={sharedAction.locationId}
            setRef={(id) => setAction({...action, locationId: id})}
          />
        </>
      )
    case ActionType.PERSONAL:
      // Role and location selector
      const personalAction = action as PersonalAction;
      return (
        <>
          <RefSelector
            label="Rôle"
            refs={game.roles}
            selectedRefId={personalAction.roleId}
            setRef={(id) => setAction({...action, roleId: id})}
          />
          <RefSelector
            label="Lieu"
            refs={game.map.locations}
            selectedRefId={personalAction.locationId}
            setRef={(id) => setAction({...action, locationId: id})}
          />
        </>
      );
    case ActionType.GROUP:
      // Multiple role and one location selector
      const groupAction = action as GroupAction;
      return (
        <>
          <RefSelector
            label="Lieu"
            refs={game.map.locations}
            selectedRefId={groupAction.locationId}
            setRef={(id) => setAction({...action, locationId: id})}
          />
          <Stack spacing={2}>
            {groupAction.roleIds.map((roleId, index) => (
              <RefSelector
                key={index}
                label="Rôle"
                refs={game.roles}
                selectedRefId={roleId}
                setRef={(id) => {
                  const newRoleIds = groupAction.roleIds.slice();
                  newRoleIds[index] = id;
                  setAction({...action, roleIds: newRoleIds});
                }}
              />
            ))}
            <NewButton
              text="Nouveau role"
              array={groupAction.roleIds}
              setArray={roleIds => setAction({...action, roleIds})}
              defaultElement={0}
            />
            <DeleteButton
              text="Supprimer le dernier role"
              array={groupAction.roleIds}
              index={groupAction.roleIds.length - 1}
              setArray={roleIds => setAction({...action, roleIds})}
            />
          </Stack>
        </>
      );
  }
}

function ActionBonusQuestionTypeSelector({action, setAction}: {action: Action, setAction: (action: Action) => void}) {
  // Select bonus question type
  const bonusQuestionType = action.bonusQuestion && getBonusQuestionType(action.bonusQuestion);
  const label = "Type de la question bonus";
  return (
    <FormControl>
      <InputLabel>Type de la question bonus</InputLabel>
      <Select
        label={label}
        value={bonusQuestionType !== undefined ? bonusQuestionType : 'none'}
        variant="outlined"
        onChange={(e) => {
          if (e.target.value === 'none') {
            setAction({...action, bonusQuestion: undefined});
          } else if (action.bonusQuestion) {
            setAction({...action, bonusQuestion: convertBonusQuestion(action.bonusQuestion!, e.target.value as BonusQuestionType)});
          } else {
            setAction({...action, bonusQuestion: convertBonusQuestion({question: ''}, e.target.value as BonusQuestionType)});
          }
        }
      }>
        <MenuItem value="none">Aucune</MenuItem>
        <MenuItem value={BonusQuestionType.SIMPLE}>Simple</MenuItem>
        <MenuItem value={BonusQuestionType.MULTIPLE_CHOICE}>Choix multiples</MenuItem>
        <MenuItem value={BonusQuestionType.OPEN}>Ouverte</MenuItem>
      </Select>
    </FormControl>
  );
}

function ActionBonusQuestionSelector({action, setAction}: {action: Action, setAction: (action: Action) => void}) {
  // Display bonus question selector if bonus question type is not none
  const bonusQuestionType = action.bonusQuestion && getBonusQuestionType(action.bonusQuestion);

  // If multiple choice, display question field and answers fields
  // If simple, display question field and answer field
  // If open, display question field
  switch (bonusQuestionType) {
    case undefined:
      return <></>;
    case BonusQuestionType.MULTIPLE_CHOICE:
      const multipleChoiceQuestion = action.bonusQuestion as MultipleChoiceQuestion;
      return (
        <>
          <TextField
            name="question"
            label="Question"
            value={multipleChoiceQuestion.question}
            variant="outlined"
            onChange={(e) => setAction({...action, bonusQuestion: {...multipleChoiceQuestion, question: e.target.value}})
          }/>
          <Stack spacing={2}>
            {multipleChoiceQuestion.answers.map((answer, index) => (
              <Stack key={index} spacing={2}>
                <TextField
                  label="Réponse"
                  value={answer.answer}
                  variant="outlined"
                  onChange={(e) => {
                    const newAnswers = multipleChoiceQuestion.answers.slice();
                    newAnswers[index] = {...answer, answer: e.target.value};
                    setAction({...action, bonusQuestion: {...multipleChoiceQuestion, answers: newAnswers}});
                  }}
                />
                <FormControlLabel
                  control={<Switch checked={answer.isCorrect} onChange={(e) => {
                    const newAnswers = multipleChoiceQuestion.answers.slice();
                    newAnswers[index] = {...answer, isCorrect: e.target.checked};
                    setAction({...action, bonusQuestion: {...multipleChoiceQuestion, answers: newAnswers}});
                  }}/>}
                  label="Correcte"
                />
              </Stack>
            ))}
            <NewButton
              text="Nouvelle réponse"
              array={multipleChoiceQuestion.answers}
              setArray={answers => setAction({...action, bonusQuestion: {...multipleChoiceQuestion, answers}})}
              defaultElement={{answer: '', isCorrect: false}}
            />
            <DeleteButton
              text="Supprimer la dernière réponse"
              array={multipleChoiceQuestion.answers}
              index={multipleChoiceQuestion.answers.length - 1}
              setArray={answers => setAction({...action, bonusQuestion: {...multipleChoiceQuestion, answers}})}
            />
            <TextField
              name="source"
              label="Source"
              value={multipleChoiceQuestion.source}
              variant="outlined"
              onChange={(e) => setAction({...action, bonusQuestion: {...multipleChoiceQuestion, source: e.target.value}})
            }/>
          </Stack>
        </>
      );
    case BonusQuestionType.SIMPLE:
      const simpleQuestion = action.bonusQuestion as SimpleQuestion;
      return (
        <>
          <TextField
            name="question"
            label="Question"
            value={simpleQuestion.question}
            variant="outlined"
            onChange={(e) => setAction({...action, bonusQuestion: {...simpleQuestion, question: e.target.value}})
          }/>
          <TextField
            name="answer"
            label="Réponse"
            value={simpleQuestion.answer}
            variant="outlined"
            onChange={(e) => setAction({...action, bonusQuestion: {...simpleQuestion, answer: e.target.value}})
          }/>
          <TextField
            name="source"
            label="Source"
            value={simpleQuestion.source}
            variant="outlined"
            onChange={(e) => setAction({...action, bonusQuestion: {...simpleQuestion, source: e.target.value}})
          }/>
        </>
      );
    case BonusQuestionType.OPEN:
      const openQuestion = action.bonusQuestion as OpenQuestion;
      return (
        <>
          <TextField
          name="question"
          label="Question"
          value={openQuestion.question}
          variant="outlined"
          onChange={(e) => setAction({...action, bonusQuestion: {...openQuestion, question: e.target.value}})
        }/>
        <TextField
          name="source"
          label="Source"
          value={openQuestion.source}
          variant="outlined"
          onChange={(e) => setAction({...action, bonusQuestion: {...openQuestion, source: e.target.value != "" ? e.target.value : undefined}})
        }/>
        </>
      );
  }   
}

interface ActionCreationCardProps {
  game: Game;
  action: Action;
  setAction: (action: Action) => void;
}

export function ActionCreationCard({game, action, setAction}: ActionCreationCardProps) {
  return (
    <CreationCard name={action.name}>
      <ActionBasicsSelector action={action} setAction={setAction}/>
      <Divider/>
      <ActionTypeSelector action={action} setAction={setAction}/>
      <ActionConditionSelector game={game} action={action} setAction={setAction}/>
      <Divider/>
      <ActionBonusQuestionTypeSelector action={action} setAction={setAction}/>
      <ActionBonusQuestionSelector action={action} setAction={setAction}/>
    </CreationCard>
  );
}