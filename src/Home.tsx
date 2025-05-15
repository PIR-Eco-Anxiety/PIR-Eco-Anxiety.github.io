import { Container, Typography, Button } from '@mui/material';
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
      <Container maxWidth='md' sx={{ textAlign: 'center', marginBottom: 2 }}>
        <Typography variant='h2' component='h1' gutterBottom>
          Res'PIR
        </Typography>
        <Typography gutterBottom variant='h4' component='h2'>
          Le jeu sérieux pour soulager l'éco-anxiété !
        </Typography>
        <ChoicePrompt prompt='' options={options}/>
        <Button variant='contained' fullWidth href='/article.pdf' component="a" sx={{ marginTop: 4 }}>
          Consulter l'article de recherche
        </Button>
      </Container>
    </Page>
  );
}

export default Home
