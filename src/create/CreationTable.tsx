import { useState } from "react";
import { useStickyState } from "../hooks/stickyState";
import { Role, Location, Action, Event, Game, game as defaultGame, RoleLocationCondition, EventCondition, ActionCondition } from "../game/definitions";
import { LocationCreationCard, RoleCreationCard, EventCreationCard, ActionCreationCard, NewButton, DeleteButton } from "./CreationCard";
import { Box, Button, Link, Stack, styled, Tab, Tabs, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { a11yProps, CustomTabPanel } from "../components/CustomTabPanel";
import { CloudDownload } from "@mui/icons-material";

interface CreationTabProps<T> {
  title: string;
  items: T[];
  defaultItem: T;
  setItems: (elements: T[]) => void;
  getElement: (element: T, index: number, f: (element: T) => void) => JSX.Element;
}

function CreationTab<T>({title, items, setItems, defaultItem, getElement}: CreationTabProps<T>) {
  return (
    <>
      <Typography variant='h4'>{title}</Typography>
      <Stack spacing={2}>
        {items.map((element, index) => (
          getElement(element, index, (element: T) => {
            items[index] = element;
            setItems(items);
          })
        ))}
        <NewButton array={items} setArray={setItems} defaultElement={defaultItem}/>
      </Stack>
    </>
  );
}

function RoleCreationTab({roles, setRoles}: {roles: Role[], setRoles: (roles: Role[]) => void}) {
  return (
    <CreationTab
      title="Création de rôles"
      items={roles}
      setItems={setRoles}
      defaultItem={{id: roles.length, name: 'Nom', description: 'Description', startLocationId: 0}}
      getElement={(role, index, f) => <RoleCreationCard key={index} role={role} setRole={f}/>
    }/>
  );
}

function LocationCreationTab({locations, setLocations}: {locations: Location[], setLocations: (locations: Location[]) => void}) {
  return (
    <CreationTab
      title="Création de lieux"
      items={locations}
      setItems={setLocations}
      defaultItem={{id: locations.length, name: 'Nom', description: 'Description', x: 0, y: 0}}
      getElement={(location, index, f) => <LocationCreationCard key={index} location={location} setLocation={f}/>
    }/>
  );
}

function EventCreationTab({events, setEvents}: {events: Event[], setEvents: (events: Event[]) => void}) {
  return (
    <CreationTab
      title="Création d'évènements"
      items={events}
      setItems={setEvents}
      defaultItem={{id: events.length, name: 'Nom', description: 'Description'}}
      getElement={(event, index, f) => <EventCreationCard key={index} event={event} setEvent={f}/>
    }/>
  );
}

function ActionCreationTab({game, actions, setActions}: {game: Game, actions: Action[], setActions: (actions: Action[]) => void}) {
  return (
    <CreationTab
      title="Création d'actions"
      items={actions}
      setItems={setActions}
      defaultItem={{id: actions.length, name: 'Nom', points: 0, description: 'Description', condition: {description: '', roleIds: [], locationId: 0}}}
      getElement={(action, index, f) => <ActionCreationCard key={index} game={game} action={action} setAction={f}/>
    }/>
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

function ImportExportButtons({game, setGame}: {game: Game, setGame: (game: Game) => void}) {
  return (
    <Stack spacing={2} direction="row">
      <Button
        component={Link}
        href={'data:application/json,' + encodeURIComponent(JSON.stringify(game, null, 2))}
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
  );
}

type GameProp = Action | Role | Location | Event;

export function CreationInterface() {
  const [game, setGame] = useStickyState<Game>(JSON.parse(JSON.stringify(defaultGame)), "gameEdit"); // Deep copy
  const [tabNumber, setTabNumber] = useState(0);

  const createSetter = (
    game: Game,
    updateGameProp: (prop: GameProp[]) => void,
    updateCondition: (condition: RoleLocationCondition, idMap: Map<number, number>) => void
  ) => {
    return (elements: GameProp[]) => {
      const idMap = new Map<number, number>();
      elements.forEach((element, index) => {
        idMap.set(element.id, index);
        element.id = index;
      });
      updateGameProp(elements);
      game.actions.forEach(action => {
        updateCondition(action.condition, idMap);
      });
    }
  }

  const setRoles = createSetter(
    game,
    (roles: any[]) => setGame({...game, roles}),
    (condition, idMap) => {
      condition.roleIds = condition.roleIds.map(roleId => idMap.get(roleId)!);
    }
  );

  const setLocations = createSetter(
    game,
    (locations: any[]) => setGame({...game, map: {locations: locations, matrix: [[]]}}),
    (condition, idMap) => {
      condition.locationId = idMap.get(condition.locationId)!;
    }
  );

  const setEvents = createSetter(
    game,
    (events: any[]) => setGame({...game, events}),
    (_condition, _idMap) => {
    }
  );

  const setActions = createSetter(
    game,
    (actions: any[]) => setGame({...game, actions}),
    (_condition, _idMap) => {}
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabNumber}
            onChange={handleChange}
            aria-label="Création de rôles, lieux, évènements et actions (tabs)"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Roles" {...a11yProps(0)} />
            <Tab label="Lieux" {...a11yProps(1)} />
            <Tab label="Evenements" {...a11yProps(2)} />
            <Tab label="Actions" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabNumber} index={0}>
          <RoleCreationTab roles={game.roles} setRoles={setRoles}/>
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={1}>
          <LocationCreationTab locations={game.map.locations} setLocations={setLocations}/>
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={2}>
          <EventCreationTab events={game.events} setEvents={setEvents}/>
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={3}>
          <ActionCreationTab game={game} actions={game.actions} setActions={setActions}/>
        </CustomTabPanel>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <ImportExportButtons game={game} setGame={setGame}/>
      </Box>
    </>
  );
}
