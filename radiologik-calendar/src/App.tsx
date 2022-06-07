import MainUi   from './components/main-ui/main-ui';
import { Header } from './components/header/header';
import { ThemeProvider,CssBaseline, Paper, Grid } from '@mui/material';

import { theme } from './styles';

const App = () => {
    return(
        <ThemeProvider
          theme={theme}
        >
          <Paper
            sx={{
              height:"100vh",
              width:"100vw",
              boxShadow: "none",
              backgroundColor: "#ece3c0"
            }}
          >
            <Grid
              container
            >
              <Grid
                item
                xs={12}
              >
                <Header/>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <MainUi/>
              </Grid>
            </Grid>
          </Paper>
          <CssBaseline/>
        </ThemeProvider>
    )
}

export default App