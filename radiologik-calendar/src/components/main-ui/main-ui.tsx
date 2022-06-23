import {
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Typography,
}
    from "@mui/material";
import {
    useState,
    useCallback,
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
    const sunday = moment().day("Sunday").hour(0).minute(0).seconds(0);
    let events: any = [];
    let currentCalendar: string = "";
    let currentEvents: string[] = [""]
    const [calendarBlocks, setCalendarBlocks] = useState(new Map<string, string[]>());
    const [numCalendars, setNumCalendars] = useState(1);
    const [multiCal, setMultiCal] = useState(false);

    // Settings dialog handlers
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDecrement = () => {
        if (numCalendars === 1) {
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
        calendarBlocks.clear(); // Reset for incoming calendar blocks
        // Initialize calendar blocks
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = () => {
            /*
                Read in lines of input file
                Every odd line = Calendar block name
                Every even line = Calendar block events
                Add these combinations to the calendarBlocks Map
            */
            const text = reader.result;
            const lines = (text as string).split(/\r\n|\n/);
            for (let index = 0; index < lines.length - 1; index++) {
                //   Creates entries 
                if (index % 2 === 0) {
                    let tempName = lines[index];
                    let tempEvents = lines[index + 1].split(/,|~/);
                    setCalendarBlocks(calendarBlocks.set(tempName, tempEvents));
                }
            }
            /*
                Confirm the amount of calendar blocks matches the numCalendars input
                if 
                    numCalendars > 1 -> and numCalendars > 1
                then
                    multiCal = true
            */
            (numCalendars === calendarBlocks.size && numCalendars > 1) ? setMultiCal(true) : setMultiCal(false);

            // Default to 1 calendar block if there is a mismatch between numCalendars and calendarBlock.size
            (numCalendars !== calendarBlocks.size) ? setNumCalendars(1) : setNumCalendars(calendarBlocks.size);
        };

        if (!e.target.files || e.target.files.length === 0) {
            alert("Error reading file!");
        } else {
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

    async function run() {
        // Refresh events and current calendar (workaround for using state values)
        currentEvents = [""];
        currentCalendar = "";
        if (multiCal) {
            console.log("Running in multi-calendar mode...");
            /*
                Loop over the calendar blocks (key)
                    set the current calendar block
                    set current calendar events  
                    parse the file
                    create calendar from parsed data
            */
            for (const [key, value] of calendarBlocks) {
                currentCalendar = key;
                currentEvents = value;

                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    if (file.name !== '') {
                        await file.text()
                        .then((response) => {
                            console.log("Parsing file '" + file.name + "'...");
                            let lines = response.split(/\r\n|\n/);
                            parseFile(lines);
                        })
                        .catch((e) => {
                            alert(e.message);
                        });
                    }else{
                        console.log("Skipping '" + file.name + "', file has no event name.");
                    }
                }
                // Only create a calendar if there are events in the event list
                (events.length > 0) ? createCalendar() : alert("Calendar creation aborted, no events in event list!");
            }
        } else {
            console.log("Running in single calendar mode...");
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                if (file.name !== '') {
                    await file.text()
                    .then((response) => {
                        console.log("Parsing file '" + file.name + "'...");
                        let lines = response.split(/\r\n|\n/);
                        parseFile(lines);
                    })
                    .catch((e) => {
                        alert(e.message);
                    });
                }else{
                    console.log("Skipping '" + file.name + "', file has no event name.");
                }  
            }
            // Only create a calendar if there are events in the event list
            (events.length > 0) ? createCalendar() : alert("Calendar creation aborted, no events in event list!");
        }
    }

    const parseFile = (lines: string[]) => {
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
                    days = [...tempDays]
                    // Determine the correct days and remove '_'
                    /*
                        File            Index   Day
                        representation
                        S______         0       Sunday
                        _M_____         1       Monday
                        __T____         2       Tuesday
                        ___W___         3       Wednesday
                        ____T__         4       Thursday
                        _____F_         5       Friday
                        ______S         6       Saturday
                    */
                    for (const [index, val] of tempDays.entries()) {
                        if (val[0] === 'S') {
                            days[index] = "Su";
                        }
                        else if (val[2] === 'T') {
                            days[index] = "Tu";
                        }
                        else if (val[4] === 'T') {
                            days[index] = "Th";
                        }
                        else if (val[6] === 'S') {
                            days[index] = "Sa";
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
            if (val !== '') {
                eventTimes.push([days[index], startTimes[index]])
            }
        }
        createEvents(eventTimes, eventName.slice(1, eventName.length - 1), duration) // Using a slice to get rid of quotation marks in the string
    }

    function createEvents(eventTimes: [string, number][], name: string, duration: number) {
        console.log("Scanning '" + name + "'...");
        for (let index = 0; index < eventTimes.length; index++) {
            let date = calculateDateTime(eventTimes[index]);
            // Skips over events with no datetime
            if(date === undefined){
                console.log("Cannot add event '" + name + "' to calendar.");
            }
            else{
                // Check to see if this event is in the current calendar
                if (multiCal) {
                    if (currentEvents.includes(name)) {
                        let startdt = date!.format('YYYYMMDDHHmmss');
                        console.log("Adding " + name + " to " + currentCalendar + " calendar block");
                        pushEvent(name, startdt, duration);
                    } else {
                        console.log(name + " is not in " + currentCalendar);
                    }
                } else { 
                    // Single Calendar creation
                    let startdt = date!.format('YYYYMMDDHHmmss');
                    console.log("Adding " + name + " to calendar...");
                    pushEvent(name, startdt, duration);
                }
            }
        }

    }

    function pushEvent(name: string, startdt: string, duration: number) {
        events.push({
            title: name,
            start: [
                parseInt(startdt!.slice(0, 4)),
                parseInt(startdt!.slice(5, 6)),
                parseInt(startdt!.slice(6, 8)),
                parseInt(startdt!.slice(8, 10)),
                parseInt(startdt!.slice(10, 12)),
            ],
            startInputType: "local",
            startOutputType: "local",
            duration: {
                minutes: duration
            },
        });
    }

    function createCalendar() {
        (multiCal) ? console.log("Creating calendar for " + currentCalendar) : console.log("Creating calendar...");
        const { error, value } = ics.createEvents(events);
        if (error) {
            console.log(error);
            alert("Error creating calendar for " + currentCalendar)
            return;
        }
        download(value);
        events = []; // Clear the events array to for the next calendar to be made
    }

    function download(val: string) {
        const element = document.createElement("a");
        const file = new Blob([val], {
            type: "text/plain"
        });
        element.href = URL.createObjectURL(file);
        // Unique calendar names will be created if multical is true
        element.download = (multiCal) ? currentCalendar.concat(".ics") : "radiologikCalendar.ics";
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
                    console.log("Value entered: " + eventTimes[0]);
                    return undefined;
            }
        }
    }

    // Dice coefficient - Used to determine the fuzzy distance between strings
    function getBigrams(str: string) {
        const bigrams = new Set();
        for (let i = 0; i < str.length - 1; i += 1) {
          bigrams.add(str.substring(i, i + 2));
        }
        return bigrams;
      }
      
    function intersect(set1: any, set2: any) {
        return new Set([...set1].filter((x) => set2.has(x)));
    }
      
    function diceCoefficient(str1: string, str2: string): number {
        const bigrams1 = getBigrams(str1);
        const bigrams2 = getBigrams(str2);
        return (2 * intersect(bigrams1, bigrams2).size) / (bigrams1.size + bigrams2.size);
    }

    return (
        <Paper
            className={classNames('uploadArea', {
                'uploadAreaActive': isAreaActive
            })}
            sx={{
                width: "80vw",
                height: "35vh",
                margin: "0 auto",
                marginBottom: "10vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "1000px"
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
                        onClick={run}
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
                                        border: "2px solid #ece3c0",
                                        borderRadius: "10px",
                                        padding: "0.5em",
                                        margin: "0.5em",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: "bold",
                                            color:"black",
                                        }}
                                    >
                                        {numCalendars}
                                    </Typography>
                                </Box>
                                <ButtonGroup
                                    disableElevation variant="outlined"
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
                                variant="outlined"
                                onClick={handleCancel}
                                sx={{
                                    marginRight: "0.4em",
                                    backgroundColor: "#ece3c0",
                                    color: "black"
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                component="label"
                                color="secondary"
                            >
                                <input type="file" hidden onChange={(e) => handleUpload(e)} />
                                <UploadFile />
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </Paper>
    )
};


export default MainUi;