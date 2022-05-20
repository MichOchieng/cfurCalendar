import React from "react";

import useStyles from './styles';

const MainUi = () => {
    const classes = useStyles();
    return (
        <div
            className={classes.test}
        >
            <h1>
                ui
            </h1>
        </div>
    )
};

export default MainUi;