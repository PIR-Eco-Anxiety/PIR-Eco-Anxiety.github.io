import { People, LocationOn } from "@mui/icons-material";
import { Stack, Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import { useState } from "react";
import { NullableRefSelector } from "../create/Common";
import { Action, isPersonalAction, isGroupAction } from "../models/action";
import { Game } from "../models/game";
import PersonIcon from '@mui/icons-material/Person';

export function ActionFilters({game, setFilteredActions}: {game: Game, setFilteredActions: (actions: Action[]) => void}) {
  const [roleIdFilter, setRoleIdFilter] = useState<number | null>(null);
  const [locationIdFilter, setLocationIdFilter] = useState<number | null>(null);

  const updateFilteredActions = (roleId: number | null, locationId: number | null) => {
    const filteredActions = game.actions.filter(
      action => roleId === null
      || isPersonalAction(action) && action.roleId === roleId
      || isGroupAction(action) && action.roleIds.includes(roleId)
    ).filter(
      action => locationId === null || action.locationId === locationId
    ); 
    setFilteredActions(filteredActions);
  }


  const updateRoleFilter = (roleId: number | null) => {
    setRoleIdFilter(roleId);
    updateFilteredActions(roleId, locationIdFilter);
  }

  const updateLocationFilter = (locationId: number | null) => {
    setLocationIdFilter(locationId);
    updateFilteredActions(roleIdFilter, locationId);
  }

  return (
    <Stack direction='column' spacing={2}>
      <NullableRefSelector
        label="Filtre de role"
        refs={game.roles}
        setRef={updateRoleFilter}
        selectedRefId={roleIdFilter}
      />
      <NullableRefSelector
        label="Filtre de lieu"
        refs={game.map.locations}
        setRef={updateLocationFilter}
        selectedRefId={locationIdFilter}
      />
    </Stack>
  );
}

export function ActionCard({game, action, onCompleteAction}: {game: Game, action: Action, onCompleteAction: () => void}) {
  return (
    <Card sx={{width: 400, display: "flex", flexDirection: "column"}} elevation={3}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h5" gutterBottom>{action.name}</Typography>
          {isPersonalAction(action) && (
            <Typography variant="body2" display='flex' alignItems='center' sx={{ gap: 2 }}>
              <PersonIcon/>
              {game.roles.find(role => role.id == action.roleId)!.name}
            </Typography>
          )}
          {isGroupAction(action) && (
            <Typography variant="body2" display='flex' alignItems='center' sx={{ gap: 2 }}>
              <People/>
              {action.roleIds.map(roleId => game.roles.find(role => role.id == roleId)!.name).join(", ")}
            </Typography>
          )}
          <Typography variant="body2" display='flex' alignItems='center' sx={{ gap: 2 }}>
            <LocationOn/>
            {game.map.locations.find(location => location.id == action.locationId)!.name}
          </Typography>
        </Stack>

      </CardContent>
      <CardActions sx={{ mt: 'auto' }}>
        <Button onClick={onCompleteAction}>
          Effectuer
        </Button>
      </CardActions>
    </Card>
  );
}