import { Box, Stack, Typography } from "@mui/material";
import { PrintPage } from "./PrintPage";
import { Action, isGroupAction, isPersonalAction } from "../models/action";
import { Game } from "../models/game";
import { Role } from "../models/role";
import { Location } from "../models/map";

export default function PrintRoleSheet({ game, role }: { game: Game, role: Role }) {
  // Role sheet contains the role's name, description, avatar (placeholder for now)
  // And a list of the role's actions, grouped by location
  const roleActions = game.actions.filter(action => {
    if (isGroupAction(action)) {
      return action.roleIds.includes(role.id)
    } else if (isPersonalAction(action)) {
      return action.roleId === role.id;
    } else {
      return false;
    }
  });

  const locations = game.map.locations.filter(
    location => roleActions.some(action => action.locationId === location.id)
  );


  return (
    <PrintPage>
      <Stack spacing={2}>
        <Typography variant='h4' color={role.color}>{role.name}</Typography>
        <Box display='flex' justifyContent='center'>
          <Box
            component='img'
            sx={{ width: 300, height: 300 }}
            src="https://cdn2.iconfinder.com/data/icons/occupations-2/500/occupation-29-1024.png"
          />
        </Box>
        <Typography variant='body1'>{role.description}</Typography>
        
        {locations.map((location, index) => (
          <RoleSheetLocation key={index} role={role} location={location} game={game}/>
        ))}
        
      </Stack>
    </PrintPage>
  )
}

function RoleSheetLocation({ game, role, location }: { game: Game, role: Role, location: Location }) {
  const actions = game.actions.filter(action => {
    return action.locationId === location.id && (isGroupAction(action) && action.roleIds.includes(role.id) || isPersonalAction(action) && action.roleId === role.id);
  });
  const getCollaborators = (action: Action) => {
    const collaborators = game.roles.filter(r => isGroupAction(action) && action.roleIds.includes(r.id) && r.id !== role.id);
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
            {action.name}
            {collaboratorsText.length > 0 && ' - avec '}
            {collaborators.map(collaborator => (
              <Typography key={collaborator.id} variant='body2' component='span' color={collaborator.color}>{collaborator.name}, </Typography>
            ))}
          </Typography>
        );
      }
      )}
    </Box>
  );
}