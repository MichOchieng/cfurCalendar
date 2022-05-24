import { Button, Grid, Paper } from "@mui/material";
import React, { ReactElement,FC, useState, useCallback } from "react";
import classNames from "classnames";
import UploadFileIcon from '@mui/icons-material/UploadFile';

import UploadArea from "../upload-area/upload-area";
import FileList from "../upload-area/file-list";



const MainUi = () => {

    // Create states for upload area and uploaded files
    const [isAreaActive,setIsAreaActive] = useState(false)
    const [files,setFiles]               = useState<File[]>([])

    // Handlers for dragging and dropping on upload area
    const onDragStateChange = useCallback((dragActive: boolean) => {
        setIsAreaActive(dragActive)
    }, [])
    const onDropFiles = useCallback((files: File[]) => {
        setFiles(files)
    }, [])

    return (
        <Grid
            container
        >
            {/* First row */}
            <Grid 
                item
                xs={6}
            >
                <Button>test</Button>
            </Grid>
            <Grid 
                item
                xs={6}
            >
                <Button>test</Button>
            </Grid>
            {/* Second row */}
            <Grid 
                item
                xs={12}
            >
                <Paper
                    className={classNames('uploadArea', {
                        'uploadAreaActive': isAreaActive
                    })}
                >
                    <UploadArea
                        onDragStateChange={onDragStateChange}
                        onDropFiles={onDropFiles}
                    >
                        <h2>Drop here</h2>
                            {files.length === 0 ? (
                                <h3>No Files to scan</h3>
                                ) :
                                (
                                    <h3>Files to scan: {files.length}</h3>
                                )
                            }
                        <FileList files={files}/>
                    </UploadArea>
                </Paper>
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