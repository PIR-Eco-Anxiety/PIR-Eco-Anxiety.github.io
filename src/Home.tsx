import { ChoicePrompt } from './components/ChoicePrompt';
import Page from './components/Page';
import { pages } from './main';


function Home() {
  const options = pages.filter(page => page.path !== '/').map(page => ({
    name: page.name,
    description: page.description,
    link: page.path
  }));

  return (
    <Page>
      <ChoicePrompt prompt='Choisissez une option' options={options}/>
    </Page>
  );
}

export default Home
