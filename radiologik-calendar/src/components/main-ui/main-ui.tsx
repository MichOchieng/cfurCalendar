import { Grid, Paper } from "@mui/material";
import React, { ReactElement,FC } from "react";


const MainUi = () => {
    return (
        <Grid
            container
        >
            {/* First row */}
            <Grid 
                item
                xs={6}
            >
                <h1>test</h1>
            </Grid>
            <Grid 
                item
                xs={6}
            >
                <h1>test3</h1>
            </Grid>
            {/* Second row */}
            <Grid 
                item
                xs={12}
            >
                <h1>test2</h1>
            </Grid>
            {/* Thrid row */}
            <Grid 
                item
                xs={12}
            >
                <h1>test4</h1>
            </Grid>
        </Grid>
    )
};

export default MainUi;