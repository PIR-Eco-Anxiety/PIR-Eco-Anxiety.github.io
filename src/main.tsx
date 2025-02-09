import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { HashRouter, Route, Routes } from 'react-router'
import { Play } from './Play.tsx'
import { Create } from './Create.tsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)
