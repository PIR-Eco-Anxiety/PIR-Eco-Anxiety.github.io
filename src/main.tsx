import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import { ThemeProvider } from '@emotion/react'
import { createTheme, CssBaseline } from '@mui/material'
import { HashRouter, Route, Routes } from 'react-router'
import { Play } from './Play.tsx'
import { Create } from './Create.tsx'
import { Print } from './print/PrintingInterface.tsx'
import { Rules } from './Rules.tsx'

const theme = createTheme({
  palette: {
    mode: 'light',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/create" element={<Create />} />
          <Route path="/print" element={<Print />} />
          <Route path="/rules" element={<Rules/>} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)
