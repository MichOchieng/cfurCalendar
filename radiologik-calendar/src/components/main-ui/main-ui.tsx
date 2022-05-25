import { 
        AppBar,
        Button,
        Container,
        Grid,
        Paper, 
        Typography 
        } 
    from "@mui/material";
import { 
        useState,
        useCallback 
        } 
    from "react";
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

    const test = () => {
        let f = files[0]
        const reader = new FileReader();
        reader.onloadend = () => {
            const txt = reader.result;
            console.log(txt);
            
        };
        reader.readAsText(f)
        
    }

    return (
        <Grid
            container
        >
            {/* First row */}
            <AppBar
                position="static"
                sx={{
                    marginBottom:"10vh",

                }}
            >
                <Container
                    maxWidth="xl"
                >
                    <Typography
                        variant="h6" 
                        component="div" 
                        sx={{ flexGrow: 1, padding:"0.5em" }}
                    >
                        Radiologik Calendar
                    </Typography>   
                </Container>
            </AppBar>
            {/* Second row */}
            <Grid 
                item
                xs={12}
            >
                <Paper
                    className={classNames('uploadArea', {
                        'uploadAreaActive': isAreaActive
                    })}
                    sx={{
                        width: "80vw",
                        height: "30vh",
                        margin:"0 auto",
                        marginBottom:"10vh",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                    }}
                >
                    <UploadArea
                        onDragStateChange={onDragStateChange}
                        onDropFiles={onDropFiles}
                        // sx={{
                        //     width: "100%",
                        //     height: "100%",
                        // }}
                    >
                        <h2>Drop files here</h2>
                            {files.length === 0 ? (
                                <h3>No files to scan</h3>
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
                xs={6}
            >
                <Button
                    onClick={test}
                >test</Button>
            </Grid>
            <Grid 
                item
                xs={6}
            >
                <Button>test</Button>
            </Grid>
        </Grid>
    )
};

export default MainUi;