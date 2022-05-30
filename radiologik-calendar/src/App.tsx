import React from 'react';

import MainUi   from './components/main-ui/main-ui';
import Header   from './components/header/header';
import { ThemeProvider,CssBaseline, Paper } from '@mui/material';

import { theme } from './styles';

const App = () => {
    return(
        <ThemeProvider
          theme={theme}
        >
          <Paper
            sx={{
              height:"100%",
              width:"100%",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              boxShadow: "none"
            }}
          >
            <MainUi/>
          </Paper>
          <CssBaseline/>
        </ThemeProvider>
    )
}

export default App