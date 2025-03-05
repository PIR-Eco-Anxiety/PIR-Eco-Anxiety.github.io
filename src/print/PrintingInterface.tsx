import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { useState } from "react";
import { game as defaultGame, Game } from "../game/definitions";
import GameSourceSelector from "../components/GameSourceSelector";
import PrintIcon from '@mui/icons-material/Print';
import PrintRoleSheet from "./RoleSheet";

enum PrintTarget {
  ROLE_SHEET,
  MAP,
}

export function Print() {
  const [elementToPrint, setElementToPrint] = useState<React.ReactElement | null>(null);
  const [printTarget, setPrintTarget] = useState<PrintTarget>(PrintTarget.ROLE_SHEET);
  const [game, setGame] = useState<Game>(defaultGame);

  return (
    <>
      {elementToPrint}
      <Box displayPrint='none'>
        <Stack spacing={2}>
          <GameSourceSelector setGame={setGame} />
          <FormControl fullWidth>
            <InputLabel>Que voulez-vous imprimer ?</InputLabel>
            <Select
              variant='outlined'
              value={printTarget}
              onChange={(event) => {
                setPrintTarget(event.target.value as PrintTarget);
              }}
            > 
              <MenuItem value={PrintTarget.ROLE_SHEET}>Une fiche de role</MenuItem>
              <MenuItem value={PrintTarget.MAP}>La carte</MenuItem>
            </Select>
          </FormControl>

          {printTarget != null && <PrintSwitch game={game} target={printTarget} setElementToPrint={setElementToPrint} />}

          <Button
            variant="contained"
            onClick={window.print}
            startIcon={<PrintIcon />}
          >
            Imprimer
          </Button>
        </Stack>
      </Box>
    </>
  )
}

function PrintSwitch({game, target, setElementToPrint}: {game: Game, target: PrintTarget, setElementToPrint: (element: React.ReactElement) => void}) {
  const [roleSelection, setRoleSelection] = useState<number>(-1);
  switch (target) {
    case PrintTarget.ROLE_SHEET:
      return (
        <Select
          label='Choisissez un role'
          variant='outlined'
          value={roleSelection}
          onChange={(event) => {
            if (event.target.value === null || typeof event.target.value !== 'number') {
              return;
            }
            const roleId = event.target.value!;
            console.log(roleId);
            setRoleSelection(roleId);
            if (roleId === -1) {
              setElementToPrint(
                <>
                  {game.roles.map((role, index) => (
                    <PrintRoleSheet key={index} game={game} role={role} />
                  ))}
                </>
              )
              return;
            }
            const role = game.roles.find(role => role.id === roleId)!;
            setElementToPrint(<PrintRoleSheet game={game} role={role} />);
          }}
        >
          <MenuItem value={-1}>Tous</MenuItem>
          {game.roles.map((role, index) => (
            <MenuItem key={index} value={role.id}>{role.name}</MenuItem>
          ))}
        </Select>
      )
    case PrintTarget.MAP:
      return <></>
    default:
      return null;
  }

}