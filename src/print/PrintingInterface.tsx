import { Alert, Box, Button, Typography } from "@mui/material";
import { useRef } from "react";
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from "react-to-print";
import Page from "../components/Page";
import { PrintPage } from "./PrintPage";

export function Print() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reactToPrint = useReactToPrint({
    contentRef,
    documentTitle: "Impression Res'PIR",
  });
  const images = [
    "/carte-rot.png",
    "/fiche-actions.png",
    "/fiche-eleve.png",
    "/fiche-elue.png",
    "/fiche-journaliste.png",
    "/fiche-professeur.png",
    "/fiche-psy.png",
    "/fiche-responsable-usine.png",
    "/fiche-scientifique.png",
  ]

  return (
    <Page>
      <Box ref={contentRef} sx={{
        // display: 'none',
        '@media print': {
          display: 'block',
        },
      }}>
        {images.map((image, index) => (
          <PrintPage key={index}>
            <img
              src={image}
              alt={`Image ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                breakAfter: 'avoid'
              }}
            />
          </PrintPage>
        ))}
      </Box>
      <Box displayPrint='none'>
        <Typography variant='h2' component='h1' sx={{ mb: 2, textAlign: 'center' }}>
          Impression
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          L'impression des fiches de role et la carte ne sont pas possibles pour les scénarios créés par les utilisateurs.
        </Alert>
        <Button
          variant="contained"
          fullWidth
          onClick={() => reactToPrint()}
          startIcon={<PrintIcon />}
        >
          Imprimer
        </Button>
      </Box>
    </Page>
  );
}