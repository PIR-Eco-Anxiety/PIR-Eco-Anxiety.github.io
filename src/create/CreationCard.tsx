import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, Divider, FormControl, FormControlLabel, List, ListItem, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import { Role, Location, Action, Event, ActionCondition, EventCondition, RoleLocationCondition, Game } from "../game/definitions";
import { useState } from "react";
import { Description, ExpandMore } from "@mui/icons-material";

export function NewButton<T>({text, array, setArray, defaultElement}: {text?: string, array: T[], setArray: (array: T[]) => void, defaultElement: T}) {
  return (
    <Button
      onClick={() => setArray([...array, defaultElement])}
      variant="contained"
    >
      {text || "Ajouter"}
    </Button>
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
        <TextField name="name" label="Nom" value={location.name} variant="outlined" onChange={onChange}/>
        <TextField name="description" label="Description" value={location.description} variant="outlined" multiline onChange={onChange}/>
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
        <TextField name="name" label="Nom" value={event.name} variant="outlined" onChange={onChange}/>
        <TextField name="description" label="Description" value={event.description} variant="outlined" multiline onChange={onChange}/>
      </AccordionDetails>
    </Accordion>
  );
}

interface ConditionListProps {
  game: Game;
  conditions: ActionCondition[];
  setConditions: (conditions: ActionCondition[]) => void;
}

interface RefSelectorProps {
  label: string;
  selectedRefId: number | undefined;
  refs: (Role | Location)[];
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

interface ConditionEditorProps {
  game: Game;
  index: number;
  condition: ActionCondition;
  setCondition: (condition: ActionCondition) => void;
}

function ConditionEditor({game, index, condition, setCondition}: ConditionEditorProps) {
  const [type, setType] = useState<boolean>(condition.hasOwnProperty('roleId'));

  const toggleType = () => {
    setType(!type);
    if (type) {
      setCondition({description: condition.description, eventId: 0, occurred: false} as EventCondition);
    } else {
      setCondition({description: condition.description, roleId: 0, locationId: 0} as RoleLocationCondition);
    }
  }

  const updateCondition = (key: string, value: any) => {
    setCondition({...condition, [key]: value});
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{condition.description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <TextField
            label="Description"
            value={condition.description}
            variant="outlined"
            onChange={(event) => updateCondition('description', event.target.value)}
            multiline
          />
          <FormControlLabel
            control={<Switch checked={type} onChange={() => toggleType()}/>}
            label={type ? 'Condition sur rôle et lieux' : 'Condition sur évènement'}
          />
          {type ? (
            <>
              <RefSelector
                label="Role"
                selectedRefId={(condition as RoleLocationCondition).roleId}
                refs={game.roles}
                setRef={(id) => updateCondition('roleId', id)}
              />
              <RefSelector
                label="Lieu"
                selectedRefId={(condition as RoleLocationCondition).locationId}
                refs={game.locations}
                setRef={(id) => updateCondition('locationId', id)}
              />
            </>
          ) : (
            <>
              <RefSelector
                label="Evenement"
                selectedRefId={(condition as EventCondition).eventId}
                refs={game.events}
                setRef={(id) => updateCondition('eventId', id)}
              />
              <FormControlLabel
                control={<Switch checked={(condition as EventCondition).occurred} onChange={(event) => updateCondition('occurred', event.target.checked)}/>}
                label={(condition as EventCondition).occurred ? "Doit s'être produit" : "Ne doit pas s'être produit"}
              />
            </>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function ConditionList({game, conditions, setConditions}: ConditionListProps) {
  return (
    <>
      <Typography variant="h5">Conditions:</Typography>
      <Stack spacing={2} divider={<Divider/>}>
        {conditions.map((condition, index) => (
          <ConditionEditor
            key={index}
            game={game}
            index={index}
            condition={condition}
            setCondition={(condition) => setConditions(conditions.map((c, i) => i === index ? condition : c))}
          />
        ))}
        <NewButton
          text="Ajouter une condition"
          array={conditions}
          setArray={setConditions}
          defaultElement={{description: 'Description'}}
        />
      </Stack>
    </>
  )
}

interface ActionCreationCardProps {
  game: Game;
  action: Action;
  setAction: (action: Action) => void;
}

export function ActionCreationCard({game, action, setAction}: ActionCreationCardProps) {

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAction({...action, [event.target.name]: event.target.value});
  }

  const setConditions = (conditions: ActionCondition[]) => {
    setAction({...action, conditions});
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{action.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Stack spacing={2} direction="row">
            <TextField name="name" label="Nom" value={action.name} variant="outlined" onChange={onChange}/>
            <TextField name="points" label="Points" value={action.points} variant="outlined" type="number" onChange={onChange}/>
          </Stack>
          <TextField name="description" label="Description" value={action.description} variant="outlined" multiline onChange={onChange}/>
          <Divider/>
          <ConditionList game={game} conditions={action.conditions} setConditions={setConditions} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}