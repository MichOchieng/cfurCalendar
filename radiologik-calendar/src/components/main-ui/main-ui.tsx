import {
    AppBar,
    Box,
    Button,
    ButtonGroup,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Input,
    Paper,
    Typography,
}
    from "@mui/material";
import {
    useState,
    useCallback
}
    from "react";
import classNames from "classnames";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import UploadArea from "../upload-area/upload-area";
import FileList from "../upload-area/file-list";
import moment from "moment";
import { UploadFile } from "@mui/icons-material";

const MainUi = () => {
    // Create states for upload area and uploaded files
    const [isAreaActive, setIsAreaActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    // Calendar related values
    const ics = require('ics');
    let events: any = [];
    const sunday = moment().day("Sunday").hour(0).minute(0).seconds(0);
    const [numCalendars, setNumCalendars] = useState(1);

    // Settings dialog handlers
    const [open, setOpen] = useState(false);
    const calendarBlocks = new Map<string,string[]>();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDecrement = () => {
        if (numCalendars == 1) {
            console.log("Must at least generate one calendar!");
        }
        else {
            setNumCalendars((numCalendars - 1))
        }
    }

    const handleCancel = () => {
        // Revert numCalendars to default, clear the calendarBlocks and close the dialog
        setNumCalendars(1);
        calendarBlocks.clear();
        setOpen(false);
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Initialize calendar blocks
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          console.log(text);
        };

        if (!e.target.files || e.target.files.length === 0) {
            console.log("Error reading file");
        }else{
            reader.readAsText(e.target.files[0]); 
        }
    
        setOpen(false);
    }
    // Handlers for dragging and dropping on upload area
    const onDragStateChange = useCallback((dragActive: boolean) => {
        setIsAreaActive(dragActive)
    }, []);
    const onDropFiles = useCallback((files: File[]) => {
        setFiles(files)
    }, []);

    // Handlers for reading files
    function readFile() {
        events = [] // Clear events for this scan
        // Loop through files from the upload area
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();  // Not a const to allow for reader to be refreshed
            reader.onloadend = () => {
                // Seperate lines of each file
                let lines = (reader.result as string).split(/\r\n|\n/);
                let days: string[] = [];
                let duration: number = 0;
                let startTimes: number[] = [];
                let eventName: string = '';
                let eventTimes: [string, number][] = [];
                for (let j = 0; j < 23; j++) {
                    // Init vars
                    switch (j) {
                        // Scheduled days
                        case 1:
                            const tempDays = lines[j].split("/");
                            days = tempDays
                            // Determine the correct days and remove '_'
                            for (const [index, val] of tempDays.entries()) {
                                if (val[0] == 'S') {
                                    days[index] = "Su";
                                }
                                else if (val[2] == 'T') {
                                    days[index] = "Tu";
                                }
                                else if (val[4] == 'S') {
                                    days[index] = "Sa";
                                }
                                else if (val[6] == 'T') {
                                    days[index] = "Th";
                                }
                                else {
                                    // Only keeps alphabetic chars
                                    days[index] = days[index].replace(/[^A-Za-z0-9]/g, "")
                                }
                            }
                            break;
                        // Duration
                        case 2:
                            duration += parseInt(lines[j].replace(" \n", ""))
                            break;
                        //  Start times
                        case 5:
                            // Converts strings of start times to ints
                            let temp1 = lines[j].split("/")
                            for (let index = 0; index < temp1.length; index++) {
                                startTimes.push(parseInt(temp1[index]) / 2)
                            }
                            break;
                        // Event name
                        case 22:
                            // Strip the first 43 chars
                            // Put everything in quotation mars in a list and grab the first occurance
                            let temp = lines[j].slice(43)
                            let temp2 = temp.match('"([^"]*?)"')
                            eventName = ((temp2 != null) ? temp2[0] : "")
                            break;
                    }
                }
                // Create a list of 'tuples' with event day and time
                for (const [index, val] of days.entries()) {
                    if (val != '') {
                        eventTimes.push([days[index], startTimes[index]])
                    }
                }
                createEvents(eventTimes, eventName, duration)
                createCalendar();
            };
            let file = files[i];
            reader.readAsText(file);
        }
    }

    function createEvents(eventTimes: [string, number][], name: string, duration: number) {
        for (let index = 0; index < eventTimes.length; index++) {
            let date = calculateDateTime(eventTimes[index]);
            let startdt = date!.format('YYYYMMDDHHmmss'); //Creates an array
            // let enddt   = date?.add(duration,"minutes").format('YYYY-M-D-H-m').split("-");
            console.log("start: " + startdt);
            events.push({
                title: name,
                start: [
                    parseInt(startdt!.slice(0, 4)),
                    parseInt(startdt!.slice(5, 6)),
                    parseInt(startdt!.slice(6, 8)),
                    parseInt(startdt!.slice(9, 10)),
                    parseInt(startdt!.slice(11, 12)),
                ],
                duration: {
                    minutes: duration
                },
            });
        }

    }

    function createCalendar() {
        const { error, value } = ics.createEvents(events);
        if (error) {
            console.log(error);
            return;
        }
        download(value);
    }

    function download(val: string) {
        const element = document.createElement("a");
        const file = new Blob([val], {
            type: "text/plain"
        });
        element.href = URL.createObjectURL(file);
        element.download = "mycal.ics";
        document.body.appendChild(element);
        element.click();
    }

    // Uses the 'sunday' const to calculate a date time from the incoming event times
    function calculateDateTime(eventTimes: [string, number]) {
        for (let index = 0; index < eventTimes.length; index++) {
            switch (eventTimes[0]) {
                case "Su":
                    return sunday.set("hour", eventTimes[1]);
                case "M":
                    return moment(sunday).add(1, 'day').set("hour", eventTimes[1]);
                case "Tu":
                    return moment(sunday).add(2, 'day').set("hour", eventTimes[1]);
                case "W":
                    return moment(sunday).add(3, 'day').set("hour", eventTimes[1]);
                case "Th":
                    return moment(sunday).add(4, 'day').set("hour", eventTimes[1]);
                case "F":
                    return moment(sunday).add(5, 'day').set("hour", eventTimes[1]);
                case "Sa":
                    return moment(sunday).add(6, 'day').set("hour", eventTimes[1]);
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
            <Grid
                item
                xs={12}
            >
                {/* First row */}
                <AppBar
                    position="static"
                    sx={{
                        marginBottom: "10vh",

                    }}
                >
                    <Container
                        maxWidth="xl"
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, padding: "0.5em" }}
                        >
                            Radiologik Calendar
                        </Typography>
                    </Container>
                </AppBar>
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
                    sx={{
                        width: "80vw",
                        height: "30vh",
                        margin: "0 auto",
                        marginBottom: "10vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Upload area and button container */}
                    <Grid
                        container
                    >
                        {/* Upload area */}
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
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
                                <FileList files={files} />
                            </UploadArea>
                        </Grid>
                        {/* Buttons */}
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "1em"
                            }}
                        >
                            <Button
                                onClick={readFile}
                                variant="contained"
                                color="secondary"
                            >Download
                            </Button>
                            <Box sx={{ width: "25%" }} />
                            <Button
                                onClick={handleClickOpen}
                                variant="contained"
                                color="secondary"
                            >Settings
                            </Button>
                            {/* Pop up dialog */}
                            <Dialog
                                open={open}
                                onClose={handleCancel}
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle>Settings</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Enter the number of calendars you would like to generate then upload a text file defining those calendars.
                                    </DialogContentText>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "2px solid #987407",
                                                borderRadius: "10px",
                                                padding: "0.5em",
                                                margin: "0.5em",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {numCalendars}
                                            </Typography>
                                        </Box>
                                        <ButtonGroup
                                            disableElevation variant="contained"
                                        >
                                            <Button
                                                onClick={() => setNumCalendars((numCalendars + 1))}
                                            >
                                                <AddCircleIcon />
                                            </Button>
                                            <Button
                                                onClick={handleDecrement}
                                            >
                                                <RemoveCircleIcon />
                                            </Button>
                                        </ButtonGroup>

                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button 
                                        variant="contained" 
                                        onClick={handleCancel}
                                        sx={{
                                            marginRight: "0.4em"
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        component="label" 
                                        color="secondary"
                                    >
                                        <input type="file" hidden onChange={(e) => handleUpload(e)}/>
                                        <UploadFile />
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
};


export default MainUi;