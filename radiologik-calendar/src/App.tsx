import React from 'react';

import MainUi   from './components/main-ui/main-ui';
import Settings from './components/settings/settings';
import Header   from './components/header/header';
import { createTheme }   from '@mui/system';
import { ThemeProvider,CssBaseline } from '@mui/material';

const theme =  createTheme({
    palette: {
        type: 'dark',
        primary: {
          main: '#000000',
        },
        secondary: {
          main: '#987407',
        },
      }
})

const App = () => {
    return(
        <>
            <CssBaseline/>
            <Header></Header>
            <MainUi></MainUi>
            <Settings/>
        </>
    )
}

export default App