import { Box, Typography } from "@mui/material";
import Page from "./components/Page";
import { HeadingLink } from "./components/NavigationDrawer";

const headings: HeadingLink[] = [
  { headingNumber: 2, headingText: "Préparation", link: "#preparation" },
  { headingNumber: 2, headingText: "Objectif", link: "#objectif" },
  { headingNumber: 2, headingText: "Déroulement de la partie", link: "#deroulement", subHeadings: [
    { headingNumber: 3, headingText: "Déplacement", link: "#deplacement" },
    { headingNumber: 3, headingText: "Actions", link: "#actions" },
  ] },
]

export function Rules() {
  return (
    <Page headings={headings}>
      <Typography variant='h2' id="regles">Règles</Typography>
      <Typography variant='h3' id="preparation">Préparation</Typography>
      <Typography variant='body1'>
        Ce jeu se joue en groupe de 4 à 6 joueurs.
        Chaque joueur choisit un rôle avant la partie.
        Un rôle ne peut être choisi que par un seul joueur, et certains rôles ne seront pas choisis.
        Placez le plateau au centre d'une table.
        Pour chaque rôle choisi, placez le pion correspondant sur le point de départ sur le plateau.
      </Typography>

      <Typography variant='h3' id="objectif">Objectif</Typography>
      <Typography variant='body1'>
        L'objectif du jeu est de <b>maximiser le score général</b> du groupe.
        Dans ce but là il sera possible de réaliser différentes actions.
        Certaines nécessiteront de se regrouper entre joueurs.
      </Typography>
      <Typography variant='h3' id="deroulement">Déroulement de la partie</Typography>
      <Typography variant='body1'>
        Le joueur le plus jeune commence.
        Un tour de jeu se déroule de la manière suivante :
      </Typography>
      <Typography variant='body1' component='div'>
        L'un après l'autre, les joueurs peuvent réaliser les deux initiatives suivantes :
        <ul>
          <li><b>Se déplacer</b> d'un lieu à un autre</li>
          <li>Réaliser une <b>action</b></li>
        </ul>
        Les deux initiatives s'effectuent l'une puis l'autre, dans l'ordre voulu par le joueur.
        Il est possible d'effectuer deux initiatives, une, ou zéro.
        Quand tous les joueurs ont joué, on fait un point sur les actions réalisées et on établit la stratégie pour le tour suivant.
      </Typography>
      <Typography variant="h4" id="deplacement">Déplacement</Typography>
      <Typography variant="body1">
        Il est possible de se déplacer d'une distance de 1 à pied, ou bien de plus de 1 en voiture.
        Les déplacements ont des coûts qui ont pour conséquence la baisse du score général.
        Les coûts sont les suivants :
      </Typography>
      <Typography variant="body1" component="div">
        <table>
          <thead>
            <tr>
              <th>Mode</th>
              <th>Distance</th>
              <th>Coût</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vélo</td> 
              <td>1</td>
              <td>-0 pts</td>
            </tr>
            <tr>
              <td>Voiture</td>
              <td>&gt; 1</td>
              <td>-5 pts</td>
            </tr>
          </tbody>
        </table>
      </Typography>
      <Typography variant="h4" id="actions">Actions</Typography>
      <Typography variant="body1">
        Les actions sont définies par un titre, un lieu, une liste de rôles requis (sauf pour les actions non-spécifiques, voir dessous). Certaines actions sont individuelles tandis que d'autres ont pour condition la réunion de plusieurs joueurs en un lieu.
        Une action réalisée durant un tour ne pourra pas être réalisée une nouvelle fois dans le même tour.
      </Typography>
      <Typography variant="body1" component="div">
        <ul>
          <li>
            Pour réaliser une <em>action individuelle</em>, le joueur déclenche l'action à son tour, à condition de se situer au bon lieu.
            S'il ne s'est pas encore déplacé, il peut le faire après son action.
          </li>
          <li>
            Pour réaliser une <em>action collective</em>, il faut que les joueurs voulant réaliser l'action soient tous présents dans le lieu.
            Le dernier joueur nécessaire pour réaliser l'action déclenche l'action. Si un joueur réalise une action collective à un tour, il ne peut pas réaliser d’action individuelle à ce même tour.
            En réalisant une action, une question est posée au.x joueur.s y ayant pris part.
            Une réponse correcte à la question apporte une bonification de points.
          </li>
          <li>
            Les actions non-spécifiques sont définies sur la fiche Actions non-spécifiques.
            Chacune est jouable une fois par tour.
          </li>
          <li>
            Les actions ne pouvant être réalisées que par certains rôles sont définies sur les cartes de chaque rôle.
          </li>
        </ul>
      </Typography>
    </Page>
  )
}