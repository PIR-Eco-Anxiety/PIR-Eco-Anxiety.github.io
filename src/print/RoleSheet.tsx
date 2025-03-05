import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Action, Game, Role, Location } from "../game/definitions";
import { PrintPage } from "./PrintPage";

export default function PrintRoleSheet({ game, role }: { game: Game, role: Role }) {
  // Role sheet contains the role's name, description, avatar (placeholder for now)
  // And a list of the role's actions, grouped by location
  const roleActions = game.actions.filter(action => action.condition.roleIds.includes(role.id));
  const locations = game.map.locations.filter(location => roleActions.some(action => action.condition.locationId === location.id));

  return (
    <PrintPage>
      <Stack spacing={2}>
        <Stack spacing={2} direction='column'>
          <Avatar>{role.name[0].toUpperCase()}</Avatar>
          <Typography variant='h4'>{role.name}</Typography>
        
        </Stack>
        <Typography variant='body1'>{role.description}</Typography>
        
        {locations.map((location, index) => (
          <RoleSheetLocation key={index} role={role} location={location} game={game}/>
        ))}
        
      </Stack>
    </PrintPage>
  )
}

function RoleSheetLocation({ game, role, location }: { game: Game, role: Role, location: Location }) {
  const actions = game.actions.filter(action => action.condition.locationId === location.id && action.condition.roleIds.includes(role.id));
  const getCollaborators = (action: Action) => {
    const collaborators = game.roles.filter(r => action.condition.roleIds.includes(r.id) && r.id !== role.id);
    return collaborators;
  }

  return (
    <Box>
      <Typography variant='h6'>{location.name}</Typography>
      {actions.map(action => {
        const collaborators = getCollaborators(action);
        let collaboratorsText = '';
        if (collaborators.length > 0) {
          collaboratorsText += ' - avec ';
          collaboratorsText += collaborators.map(collaborator => collaborator.name).join(', ');
        }
        return (
          <Typography key={action.id} variant='body2'>
            {action.name}{collaboratorsText}
          </Typography>
        );
      }
      )}
    </Box>
  );
}