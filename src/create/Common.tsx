import { Button, Stack, Typography, FormControlLabel, Switch, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export interface NewButtonProps<T> {
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

export interface DeleteButtonProps<T> {
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

export interface OptionalProps {
  text: string;
  activated: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  children: React.ReactNode;
}

export function Optional({text, activated, onActivate, onDeactivate, children}: OptionalProps) {
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

export interface ConditionalProps {
  falseText: string;
  trueText: string;
  condition: boolean;
  onToggle: (condition: boolean) => void;
  children: React.ReactNode;
}

export function Conditional({falseText, trueText, condition, onToggle, children}: ConditionalProps) {
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

interface HasNameID {
  name: string;
  id: number;
}

export interface RefSelectorProps {
  label: string;
  selectedRefId: number | undefined;
  refs: (HasNameID)[];
  setRef: (id: number) => void;
}

export function RefSelector({label, refs, setRef, selectedRefId}: RefSelectorProps) {
  return (
    <FormControl>
      <InputLabel id="ref-selector-label">{label}</InputLabel>
      <Select
        labelId="ref-selector-label"
        label={label}
        value={refs.find(ref => ref.id === selectedRefId)?.name || '' }
        variant="outlined"
        onChange={(event) => {setRef(refs.find(ref => ref.name === event.target.value)!.id)}}
      >
        {refs.map((ref, index) => (
          <MenuItem key={index} value={ref.name}>{ref.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export interface NullableRefSelectorProps {
  label: string;
  selectedRefId: number | null;
  refs: (HasNameID)[];
  setRef: (id: number | null) => void;
}

export function NullableRefSelector({label, refs, setRef, selectedRefId}: NullableRefSelectorProps) {
  return (
    <FormControl>
      <InputLabel id="ref-selector-label">{label}</InputLabel>
      <Select
        labelId="ref-selector-label"
        label={label}
        value={selectedRefId === null ? '' : refs.find(ref => ref.id === selectedRefId)?.name || '' }
        variant="outlined"
        onChange={(event) => {setRef(event.target.value === '' ? null : refs.find(ref => ref.name === event.target.value)!.id)}}
      >
        <MenuItem value="">Aucun</MenuItem>
        {refs.map((ref, index) => (
          <MenuItem key={index} value={ref.name}>{ref.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}