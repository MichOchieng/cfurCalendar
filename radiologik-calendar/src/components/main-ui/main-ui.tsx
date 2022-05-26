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
import { Builder, Calendar } from "ikalendar";

import UploadArea from "../upload-area/upload-area";
import FileList from "../upload-area/file-list";
import moment from "moment";

const MainUi = () => {

    // Create states for upload area and uploaded files
    const [isAreaActive,setIsAreaActive] = useState(false);
    const [files,setFiles]               = useState<File[]>([]);

    const events = [];
    const sunday = moment().day("Sunday").set("hour",0).set("minute",0).set("second",0);

    // Handlers for dragging and dropping on upload area
    const onDragStateChange = useCallback((dragActive: boolean) => {
        setIsAreaActive(dragActive)
    }, []);
    const onDropFiles = useCallback((files: File[]) => {
        setFiles(files)
    }, []);

    // Handlers for reading files
    function readFile (){
        // Loop through files from the upload area
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();  // Not a const to allow for reader to be refreshed
            reader.onloadend = () => {
                // Seperate lines of each file
                let lines = (reader.result as string).split(/\r\n|\n/);
                let days:       string[] = [];
                let duration:   number   = 0;
                let startTimes: number[] = [];
                let eventName:  string   = '';
                let eventTimes: [string,number][] = [];
                for (let j = 0; j < 23; j++) {
                    // Init vars
                    switch(j){
                        // Scheduled days
                        case 1:
                            const tempDays = lines[j].split("/");
                            days = tempDays
                            // Determine the correct days and remove '_'
                            for (const [index,val] of tempDays.entries()) {
                                if (val[0] == 'S'){
                                    days[index] = "Su";
                                }
                                else if (val[2] == 'T'){
                                    days[index] = "Tu";
                                }
                                else if (val[4] == 'S'){
                                    days[index] = "Sa";
                                }
                                else if (val[6] == 'T'){
                                    days[index] = "Th";
                                }
                                else {
                                    // Only keeps alphabetic chars
                                    days[index] = days[index].replace(/[^A-Za-z0-9]/g,"") 
                                }
                            }
                            break;
                        // Duration
                        case 2:
                            duration += parseInt(lines[j].replace(" \n",""))
                            break;
                        //  Start times
                        case 5:
                            // Converts strings of start times to ints
                            let temp1 = lines[j].split("/")
                            for (let index = 0; index < temp1.length; index++) {
                                startTimes.push(parseInt(temp1[index])/2)
                            }
                            break;
                        // Event name
                        case 22:
                            // Strip the first 43 chars
                            // Put everything in quotation mars in a list and grab the first occurance
                            let temp   = lines[j].slice(43)
                            let temp2  = temp.match('"([^"]*?)"')
                            eventName  = ((temp2 != null) ? temp2[0] : "")
                            break;
                    }
                }
                // Create a list of 'tuples' with event day and time
                for (const [index,val] of days.entries()) {
                    if (val != ''){
                        eventTimes.push([days[index],startTimes[index]])
                    }
                }
                createEvents(eventTimes,eventName,duration)
            };
            let file = files[i];
            reader.readAsText(file);
        }
    }

    function createEvents(eventTimes: [string,number][], name: string, duration: number){
        for (let index = 0; index < eventTimes.length; index++) {
            let startdt = calculateDateTime(eventTimes[index]);
            let enddt = moment(startdt).add(duration,"minutes");
            console.log(name);
            console.log(startdt);
            console.log(enddt);
        }
    }

    // Uses the 'sunday' const to calculate a date time from the incoming event times
    function calculateDateTime(eventTimes: [string,number]){
        for (let index = 0; index < eventTimes.length; index++) {
            switch (eventTimes[0]) {
                case "Su":
                    return sunday.set("hour",eventTimes[1]);
                case "M":
                    return moment(sunday).add(1,'day').set("hour",eventTimes[1]);
                case "Tu":
                    return moment(sunday).add(2,'day').set("hour",eventTimes[1]);
                case "W":
                    return moment(sunday).add(3,'day').set("hour",eventTimes[1]);
                case "Th":
                    return moment(sunday).add(4,'day').set("hour",eventTimes[1]);
                case "F":
                    return moment(sunday).add(5,'day').set("hour",eventTimes[1]);
                case "Sa":
                    return moment(sunday).add(6,'day').set("hour",eventTimes[1]);
                default:
                    console.log("Error occured calculating event datetime!")
                    break;
            }
        }
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
                    >
                        <h2> Drop files here</h2>
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
                    onClick={readFile}
                    variant="contained"
                    color="secondary"
                >Run</Button>
            </Grid>
            <Grid 
                item
                xs={6}
            >
                <Button
                    variant="contained"
                    color="secondary"
                >Settings</Button>
            </Grid>
        </Grid>
    )
};

export default MainUi;