import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, styled,  } from "@mui/material";
import React, { useState } from "react";
import { useStickyState } from "../hooks/stickyState";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import defaultGame from "../defaultGame.json";
import { Game } from "../models/game";

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

enum GameSource {
  DEFAULT,
  LOCAL,
  IMPORT
}

export default function GameSourceSelector({ setGame }: { setGame: (game: Game) => void }) {
  const [useFileUpload, setUseFileUpload] = useState<boolean>(false);
  const [localGame] = useStickyState<Game>(JSON.parse(JSON.stringify(defaultGame)), 'gameEdit');
  const [source, setSource] = useState<GameSource>(GameSource.DEFAULT);

  const handleGameSourceSelection = (event: SelectChangeEvent<GameSource>) => {
    const source = event.target.value;
    switch (source) {
      case GameSource.DEFAULT:
        setGame(defaultGame);
        setSource(GameSource.DEFAULT);
        setUseFileUpload(false);
        break;
      case GameSource.LOCAL:
        setGame(localGame);
        setSource(GameSource.LOCAL);
        setUseFileUpload(false);
        break;
      case GameSource.IMPORT:
        setUseFileUpload(true);
        setSource(GameSource.IMPORT);
        break;
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.files && event.target.files[0].text().then(text => {
      setGame(JSON.parse(text));
    });
  }

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Source de la partie</InputLabel>
        <Select
          label = "Source de la partie"
          id="x"
          variant='outlined'
          value={source}
          onChange={handleGameSourceSelection}
        >
          <MenuItem value={GameSource.DEFAULT}>Partie par défaut</MenuItem>
          <MenuItem value={GameSource.LOCAL}>Partie sauvegardée dans la page de création</MenuItem>
          <MenuItem value={GameSource.IMPORT}>Importer une partie</MenuItem>
        </Select>
      </FormControl>
      { useFileUpload && 
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
            onChange={handleFileUpload}
          />
        </Button>
      }
    </>
  );
}