import './Home.css'
import { ChoicePrompt } from './components/ChoicePrompt';


function Home() {
  const options = [
    { name: "Jouer", description: "Commencer une partie", link: "/#/play" },
    { name: "Créer", description: "Créez un scénario", link: "/#/create" },
  ]

  return (
    <ChoicePrompt prompt='Choisissez une option' options={options}/>
  );
}

export default Home
