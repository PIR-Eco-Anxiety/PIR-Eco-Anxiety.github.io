import { ChoicePrompt } from './components/ChoicePrompt';


function Home() {
  const options = [
    { name: "Jouer", description: "Commencer une partie", link: "/#/play" },
    { name: "Créer", description: "Créez un scénario", link: "/#/create" },
    { name: "Imprimer", description: "Imprimez le support physique", link: "/#/print" },
    { name: "Règles", description: "Lire les règles du jeu", link: "/#/rules" }
  ]

  return (
    <ChoicePrompt prompt='Choisissez une option' options={options}/>
  );
}

export default Home
