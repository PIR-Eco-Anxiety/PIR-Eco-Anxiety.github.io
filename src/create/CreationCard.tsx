import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, FormControlLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import { Role, Location, Action, Event, ActionCondition, EventCondition, RoleLocationCondition, Game, OpenQuestion, MultipleChoiceQuestion } from "../game/definitions";
import { useState } from "react";
import { ExpandMore } from "@mui/icons-material";


interface NewButtonProps<T> {
  text?: string;
  array: T[];
  setArray: (array: T[]) => void;
  defaultElement: T;
}

export function NewButton<T>({text, array, setArray, defaultElement}: NewButtonProps<T>) {
  return (
    <Button
      onClick={() => setArray([...array, defaultElement])}
      variant="contained"
    >
      {text || "Ajouter"}
    </Button>
  );
}

interface DeleteButtonProps<T> {
  text?: string;
  index: number;
  array: T[];
  setArray: (array: T[]) => void;
}

export function DeleteButton<T>({text, index, array, setArray}: DeleteButtonProps<T>) {
  return (
    <Button
      onClick={() => setArray(array.filter((_, i) => i !== index))}
      variant="contained"
    >
      {text || "Supprimer"}
    </Button>
  );
}

interface ListEditorProps<T> {
  array: T[];
  setArray: (array: T[]) => void;
  getElement: (item: T, index: number) => React.ReactNode;
}
  

interface OptionalProps {
  text: string;
  activated: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  children: React.ReactNode;
}

function Optional({text, activated, onActivate, onDeactivate, children}: OptionalProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">{text}</Typography>
      <FormControlLabel
        control={<Switch checked={activated} onChange={(event) => {
          if (event.target.checked) {
            onActivate();
          } else {
            onDeactivate();
          }
        }}/>}
        label="Activer"
      />
      {activated && children}
    </Stack>
  );
}

interface ConditionalProps {
  falseText: string;
  trueText: string;
  condition: boolean;
  onToggle: (condition: boolean) => void;
  children: React.ReactNode;
}

function Conditional({falseText, trueText, condition, onToggle, children}: ConditionalProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">{condition ? trueText : falseText}</Typography>
      <FormControlLabel
        control={<Switch checked={condition} onChange={(event) => onToggle(event.target.checked)}/>}
        label="Activer"
      />
      {condition && children}
    </Stack>
  );
}

export function RoleCreationCard({role, setRole}: {role: Role, setRole: (role: Role) => void}) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole({...role, [event.target.name]: event.target.value});
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{role.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <TextField name="name" label="Nom" value={role.name} variant="outlined" onChange={onChange}/>
          <TextField name="description" label="Description" value={role.description} variant="outlined" multiline onChange={onChange}/>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export function LocationCreationCard({location, setLocation}: {location: Location, setLocation: (location: Location) => void}) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({...location, [event.target.name]: event.target.value});
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{location.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <TextField name="name" label="Nom" value={location.name} variant="outlined" onChange={onChange}/>
          <TextField name="description" label="Description" value={location.description} variant="outlined" multiline onChange={onChange}/>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export function EventCreationCard({event, setEvent}: {event: Event, setEvent: (event: Event) => void}) {
  const onChange = (event2: React.ChangeEvent<HTMLInputElement>) => {
    setEvent({...event, [event2.target.name]: event2.target.value})
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{event.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <TextField name="name" label="Nom" value={event.name} variant="outlined" onChange={onChange}/>
          <TextField name="description" label="Description" value={event.description} variant="outlined" multiline onChange={onChange}/>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

interface RefSelectorProps {
  label: string;
  selectedRefId: number | undefined;
  refs: (Role | Location | Event)[];
  setRef: (id: number) => void;
}

function RefSelector({label, refs, setRef, selectedRefId}: RefSelectorProps) {
  return (
    <Select
      label={label}
      value={refs.find(ref => ref.id === selectedRefId)?.name || '' }
      variant="outlined"
      onChange={(event) => {setRef(refs.find(ref => ref.name === event.target.value)!.id)}}
    >
      {refs.map((ref, index) => (
        <MenuItem key={index} value={ref.name}>{ref.name}</MenuItem>
      ))}
    </Select>
  );
}

function ActionBasicsSelector({action, setAction}: {action: Action, setAction: (action: Action) => void}) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAction({...action, [event.target.name]: event.target.value});
  }

  return (
    <>
      <Stack spacing={2}>
        <TextField name="name" label="Nom" value={action.name} variant="outlined" onChange={onChange}/>
        <TextField name="points" label="Points" value={action.points} variant="outlined" type="number" onChange={onChange}/>
      </Stack>
      <TextField name="description" label="Description" value={action.description} variant="outlined" multiline onChange={onChange}/>
    </>
  );
}

function ActionConditionSelector({game, action, setAction}: {game: Game, action: Action, setAction: (action: Action) => void}) {
  return (
    <>
      <RefSelector
        label="Lieu"
        refs={game.map.locations}
        setRef={(locationId) => setAction({...action, condition: {...action.condition, locationId}})}
        selectedRefId={action.condition.locationId}
      />
      <Divider/>
      {/* Select roles */}
      <Stack spacing={2}>
        <Typography variant="h5">Roles</Typography>
        <Typography variant="body2">Laissez vide pour autoriser tout le monde</Typography>
        {action.condition.roleIds.map((roleId, index) => (
          <RefSelector
            key={index}
            label="Role"
            refs={game.roles}
            setRef={(roleId) => setAction({...action, condition: {
              ...action.condition,
              roleIds: action.condition.roleIds.map((id, i) => i === index ? roleId : id)
            }})}
            selectedRefId={roleId}
          />
        ))}
        <NewButton
          text="Ajouter un role"
          array={action.condition.roleIds}
          setArray={(roleIds) => setAction({...action, condition: {...action.condition, roleIds}})}
          defaultElement={0}
        />
        <DeleteButton
          text="Supprimer un role"
          index={0}
          array={action.condition.roleIds}
          setArray={(roleIds) => setAction({...action, condition: {...action.condition, roleIds}})}
        />
      </Stack>
    </>
  );
}

function ActionBonusQuestionSelector({action, setAction}: {action: Action, setAction: (action: Action) => void}) {
  const active = action.bonusQuestion !== undefined;
  const openQuestion = action.bonusQuestion?.hasOwnProperty('answer') || false;
  const defaultOpenQuestion = {question: 'Question', multiplier: 1, answer: 'Réponse'};
  const defaultMultipleChoiceQuestion = {question: 'Question', multiplier: 1, answers: [{answer: 'Réponse', isCorrect: true}]};
  const answers = (action.bonusQuestion as MultipleChoiceQuestion)?.answers || [];

  return (
    <>
      <Optional
        text="Question bonus"
        activated={active}
        onActivate={() => setAction({...action, bonusQuestion: defaultMultipleChoiceQuestion})}
        onDeactivate={() => setAction({...action, bonusQuestion: undefined})}
      >
        <TextField
          label="Question"
          value={action.bonusQuestion?.question || ''}
          variant="outlined"
          onChange={(event) => setAction({...action, bonusQuestion: {...action.bonusQuestion!, question: event.target.value}})}
        />
        <Conditional
          trueText="Question ouverte"
          falseText="Question à choix multiples"
          condition={action.bonusQuestion?.hasOwnProperty('answer') || false}
          onToggle={(condition) => setAction({...action, bonusQuestion: condition ? defaultOpenQuestion : defaultMultipleChoiceQuestion})}
        >
          {openQuestion ? (
            <TextField
              label="Réponse"
              value={(action.bonusQuestion as OpenQuestion).answer}
              variant="outlined"
              onChange={(event) => setAction({...action, bonusQuestion: {...action.bonusQuestion!, answer: event.target.value}})}
            />
          ) : (
            
            <>
              {answers.map((answer, index) => (
                <Stack spacing={2} key={index}>
                  <TextField
                    label="Réponse"
                    value={answer.answer}
                    variant="outlined"
                    onChange={(event) => setAction({...action, bonusQuestion: {
                      ...action.bonusQuestion!,
                      answers: answers.map((ans, i) => i === index ? {answer: event.target.value, isCorrect: ans.isCorrect} : ans)
                    }})}
                  />
                  <FormControlLabel
                    control={<Switch checked={answer.isCorrect} onChange={(event) => setAction({...action, bonusQuestion: {
                      ...action.bonusQuestion!,
                      answers: answers.map((ans, i) => i === index ? {answer: ans.answer, isCorrect: event.target.checked} : ans)
                    }})}/>}
                    label="Correct"
                  />
                </Stack>
              ))}
              <NewButton
                text="Ajouter une réponse"
                array={answers}
                setArray={(answers) => setAction({...action, bonusQuestion: {...action.bonusQuestion!, answers}})}
                defaultElement={{answer: 'Réponse', isCorrect: true}}
              />
              <DeleteButton
                text="Supprimer une réponse"
                index={0}
                array={answers}
                setArray={(answers) => setAction({...action, bonusQuestion: {...action.bonusQuestion!, answers}})}
              />
            </>
          )}
        </Conditional>
      </Optional>
    </>
  );
}

interface ActionCreationCardProps {
  game: Game;
  action: Action;
  setAction: (action: Action) => void;
}

export function ActionCreationCard({game, action, setAction}: ActionCreationCardProps) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{action.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2} divider={<Divider/>}>
          <ActionBasicsSelector action={action} setAction={setAction}/>
          <ActionConditionSelector game={game} action={action} setAction={setAction}/>
          <ActionBonusQuestionSelector action={action} setAction={setAction}/>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}