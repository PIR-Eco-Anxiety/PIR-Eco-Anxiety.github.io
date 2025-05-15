import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { IconButton, Link, Stack, styled, Tooltip } from '@mui/material';
import { Description, Menu as MenuIcon } from '@mui/icons-material';
import { drawerWidth } from './NavigationDrawer';
import GitHub from '@mui/icons-material/GitHub';



export interface Page {
  name: string;
  path: string;
  subpages?: Page[];
}

export interface NavBarProps {
  pages: Page[];
  handleDrawerToggle: () => void;
  drawer: boolean;
}

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export function NavBar({ drawer, pages, handleDrawerToggle }: NavBarProps) {

  return (
    <>
      <AppBar
        position='fixed'
        sx={
          drawer ? (
            { width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }
          ) : (
            { width: { xs: '100%', sm: '80%', md: '60%'}, left: { xs: 0, sm: "10%", md: '20%' } }
          )
        }
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: drawer ? { sm: 'none' } : 'none' }}
              >
                <MenuIcon />
              </IconButton>
              {pages.map((page, index) => (
                <Button key={index} href={page.path} color='inherit'> 
                  {page.name}
                </Button>
              ))}
            </Box>
            <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            <Tooltip title="Consulter l'article de recherche" arrow>
              <Link href="/article.pdf" color="inherit" component="a">
                <Description sx={{ width: 32, height: 32 }}/>
              </Link>
            </Tooltip>
            <Link href="https://github.com/PIR-Eco-Anxiety/PIR-Eco-Anxiety.github.io" color='inherit'>
              <GitHub sx={{ width: 32, height: 32 }}/>
            </Link>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Offset />
    </>
  );
}