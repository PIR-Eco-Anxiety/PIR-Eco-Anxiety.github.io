import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home.tsx'
import { createTheme, CssBaseline, LinkProps, responsiveFontSizes, ThemeProvider } from '@mui/material'
import { HashRouter, Routes, Route, LinkProps as RouterLinkProps } from 'react-router'
import { HashLink as RouterLink } from 'react-router-hash-link'
import { Play } from './Play.tsx'
import { Create } from './Create.tsx'
import { Print } from './print/PrintingInterface.tsx'
import { Rules } from './Rules.tsx'
import React from 'react'

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

let theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButton: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiListItemButton: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiCardActionArea: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiTypography: {
      defaultProps: {
        gutterBottom: true,
      },
    }
  },
  colorSchemes: {
    // light: true,
    dark: true
  }
})

theme = responsiveFontSizes(theme, {
  factor: 2.5
})

export const pages = [
  { name: 'Acceuil', path: '/', element: <Home />, description: "Retourner à l'acceuil" },
  { name: 'Jouer', path: '/play', element: <Play />, description: "Commencer une partie" },
  { name: 'Créer', path: '/create', element: <Create />, description: "Créez un scénario" },
  { name: 'Imprimer', path: '/print', element: <Print />, description: "Imprimez le support physique" },
  { name: 'Règles', path: '/rules', element: <Rules />, description: "Lire les règles du jeu" },
]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          {pages.map((page, index) => (
            <Route key={index} path={page.path} element={page.element} />
          ))}
        </Routes>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)
