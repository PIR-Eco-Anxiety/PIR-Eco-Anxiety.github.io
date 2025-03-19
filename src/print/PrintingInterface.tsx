import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { useRef, useState } from "react";
import GameSourceSelector from "../components/GameSourceSelector";
import PrintIcon from '@mui/icons-material/Print';
import PrintRoleSheet from "./RoleSheet";
import { Game } from "../models/game";
import defaultGame from "../defaultGame.json";
import { useReactToPrint } from "react-to-print";
import Page from "../components/Page";

enum PrintTarget {
  ROLE_SHEET,
  MAP,
}

export function Print() {
  const [elementToPrint, setElementToPrint] = useState<React.ReactElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [printTarget, setPrintTarget] = useState<PrintTarget>(PrintTarget.ROLE_SHEET);
  const [game, setGame] = useState<Game>(defaultGame);
  const reactToPrint = useReactToPrint({
    contentRef,
    documentTitle: 'Impression JDS',
    
  });


  return (
    <Page>
      <Box ref={contentRef} sx={{
        color: 'black',
        display: 'none',
        '@media print': {
          display: 'block',
        },
      }}>
        {elementToPrint}
      </Box>
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
            onClick={() => reactToPrint()}
            startIcon={<PrintIcon />}
          >
            Imprimer
          </Button>
        </Stack>
      </Box>
    </Page>
  );
}

function PrintSwitch({game, target, setElementToPrint}: {game: Game, target: PrintTarget, setElementToPrint: (element: React.ReactElement) => void}) {
  const [roleSelection, setRoleSelection] = useState<string>('');
  const printAll = () => {
    setElementToPrint(
      <>
        {game.roles.map((role, index) => (
          <PrintRoleSheet key={index} game={game} role={role} />
        ))}
      </>
    )
  }

  const printRole = (roleId: number) => {
    const role = game.roles.find(role => role.id === roleId)!;
    setElementToPrint(<PrintRoleSheet game={game} role={role} />);
  }

  switch (target) {
    case PrintTarget.ROLE_SHEET:
      const label = "Choisissez un role";
      return (
        <FormControl>
          <InputLabel>{label}</InputLabel>
          <Select
            label={label}
            variant='outlined'
            value={roleSelection}
            onChange={(event) => {
              if (event.target.value === null || typeof event.target.value !== 'number') {
                return;
              }
              const roleId = event.target.value!;
              setRoleSelection(roleId);
              if (roleId === -1) {
                printAll();
                return;
              }
              printRole(roleId);
            }}
          >
            <MenuItem value={-1}>Tous</MenuItem>
            {game.roles.map((role, index) => (
              <MenuItem key={index} value={role.id}>{role.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    case PrintTarget.MAP:
      return <></>
    default:
      return null;
  }

}