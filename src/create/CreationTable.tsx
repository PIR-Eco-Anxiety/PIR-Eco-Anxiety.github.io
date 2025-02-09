import { useState } from "react";
import { CardColumn, CardTable } from "../components/CardTable";
import { Role, Location, Action, Event, Game, game as defaultGame, RoleLocationCondition, EventCondition } from "../game/definitions";
import { LocationCreationCard, RoleCreationCard, EventCreationCard, ActionCreationCard, NewButton } from "./CreationCard";
import { Box, Button, Link, Stack, styled, Tab, Tabs, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { a11yProps, CustomTabPanel } from "../components/CustomTabPanel";
import { CloudDownload } from "@mui/icons-material";


function RoleCreationTable({roles, setRoles}: {roles: Role[], setRoles: (roles: Role[]) => void}) {
  return (
    <>
      <Typography variant='h4'>Création de rôles</Typography>
      <Stack spacing={2}>
        {roles.map((role, index) => (
          <RoleCreationCard key={index} role={role} setRole={
            (role: Role) => {
              roles[index] = role;
              setRoles(roles);
            }
          }/>
        ))}
        <NewButton array={roles} setArray={setRoles} defaultElement={{id: roles.length, name: 'Nom', description: 'Description'}}/>
      </Stack>
    </>
  );
}

function LocationCreationTable({locations, setLocations}: {locations: Location[], setLocations: (locations: Location[]) => void}) {
  return (
    <CardTable title={'Création de lieux'}>
      <CardColumn>
        {locations.map((location, index) => (
          <LocationCreationCard key={index} location={location} setLocation={
            (location: Location) => {
              locations[index] = location;
              setLocations(locations);
            }
          }/>
        ))}
        <NewButton array={locations} setArray={setLocations} defaultElement={{id: locations.length, name: 'Nom', description: 'Description'}}/>
      </CardColumn>
    </CardTable>
  );
}

function EventCreationTable({events, setEvents}: {events: Event[], setEvents: (events: Event[]) => void}) {
  return (
    <CardTable title={'Création d\'évènements'}>
      <CardColumn>
        {events.map((event, index) => (
          <EventCreationCard key={index} event={event} setEvent={
            (event: Event) => {
              events[index] = event;
              setEvents(events);
            }
          }/>
        ))}
        <NewButton array={events} setArray={setEvents} defaultElement={{id: events.length, name: 'Nom', description: 'Description'}}/>
      </CardColumn>
    </CardTable>
  );
}

function ActionCreationTable({game, actions, setActions}: {game: Game, actions: Action[], setActions: (actions: Action[]) => void}) {
  return (
    <Stack spacing={1}> 
      {actions.map((action, index) => (
        <ActionCreationCard key={index} game={game} action={action} setAction={
          (action: Action) => {
            actions[index] = action;
            setActions(actions);
          }
        }/>
      ))}
      <NewButton 
        text="Ajouter une action"
        array={actions}
        setArray={setActions}
        defaultElement={{id: actions.length, name: 'Nom', description: 'Description', points: 0, conditions: []}}/>
    </Stack>
  );
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function CreationInterface() {
  const [game, setGame] = useState<Game>(JSON.parse(JSON.stringify(defaultGame))); // Deep copy
  const [value, setValue] = useState(0);

  const setRoles = (roles: Role[]) => {
    setGame({...game, roles})
    // Update game.roles ids and reflect changes in game.actions conditions
    const idMap = new Map<number, number>();
    roles.forEach((role, index) => {
      idMap.set(role.id, index);
      role.id = index;
    });
    setGame({...game, roles})
    game.actions.forEach(action => {
      action.conditions.forEach(condition => {
        if (condition.hasOwnProperty('roleId')) {
          const c = condition as RoleLocationCondition;
          c.roleId = idMap.get(c.roleId) ?? 0;
        }
      });
    });
  };

  const setLocations = (locations: Location[]) => {
    setGame({...game, locations})
    // Update game.locations ids and reflect changes in game.actions conditions
    const idMap = new Map<number, number>();
    locations.forEach((location, index) => {
      idMap.set(location.id, index);
      location.id = index;
    });
    setGame({...game, locations});
    game.actions.forEach(action => {
      action.conditions.forEach(condition => {
        if (condition.hasOwnProperty('locationId')) {
          const c = condition as RoleLocationCondition;
          c.locationId = idMap.get(c.locationId) ?? 0;
        }
      });
    });
  }

  const setEvents = (events: Event[]) => {
    setGame({...game, events})
    // Update game.events ids and reflect changes in game.actions conditions
    const idMap = new Map<number, number>();
    events.forEach((event, index) => {
      idMap.set(event.id, index);
      event.id = index;
    });
    setGame({...game, events});
    game.actions.forEach(action => {
      action.conditions.forEach(condition => {
        if (condition.hasOwnProperty('eventId')) {
          const c = condition as EventCondition;
          c.eventId = idMap.get(c.eventId) ?? 0;
        }
      });
    });
  }

  const setActions = (actions: Action[]) => {
    actions.forEach((action, index) => {
      action.id = index;
    });
    setGame({...game, actions});
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Roles" {...a11yProps(0)} />
            <Tab label="Lieux" {...a11yProps(1)} />
            <Tab label="Evenements" {...a11yProps(2)} />
            <Tab label="Actions" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <RoleCreationTable roles={game.roles} setRoles={setRoles}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <LocationCreationTable locations={game.locations} setLocations={setLocations}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <EventCreationTable events={game.events} setEvents={setEvents}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <ActionCreationTable game={game} actions={game.actions} setActions={setActions}/>
        </CustomTabPanel>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Stack spacing={2} direction="row">
          <Button
            component={Link}
            href={'data:application/json,' + encodeURIComponent(JSON.stringify(game))}
            download="game.json"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudDownload />}
          >
            Exporter
          </Button>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Importer
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => {
                console.log(event.target.files);
                event.target.files && event.target.files[0].text().then(text => {
                  setGame(JSON.parse(text));
                });
              }}
            />
          </Button>
        </Stack>
      </Box>
    </>
  );
}