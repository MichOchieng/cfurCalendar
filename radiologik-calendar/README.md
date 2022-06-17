# Radiologik Calendar
Radiologik Scheduler is the companion app to Radiologik DJ. It schedules to DJ's program queue using iTunes/Music playlists to allow a 24/7 fully-automated station. This is a web application used to convert Radiologik Scheduler files into calendars following the .ical (RFC 5545) format. 

## Usage

### Radiologik Files
This application uses one or more Radiologik Scheduler files to generate calendars, a directory of these files typically can be found in the following location 

~/Music/Radiologik/Schedule/
### Input File
Input files will typically have the following structure:

    Radiologik Schedule Segment
    _M_____/_______/____T__/_______E    
    60                                  *This is the duration of the segment*
    Default
    ProgramTo=2
    34/38/44/4                          *These are the *
    0

    Always
    Never
    ProgramCopyPath=nopath
    ColorLabel=187,136,204
    0
    False
    Display=True
    PlayRotatediniTunes=False
    Notes=
    PrePostAppleScripts=	
    AlbumSeparation=0
    SilenceSensorProfile=
    Enabled=True
    RotationType=0
    LastLog=<cr>----------- Programming Segment "Ether in the Attic" (Start time: 5:00 PM Length: 60 mins) started on Jun 6, 2022 at 4:40:02 PM
    ...

#### Notable elements
* _M_____/_______/____T__/_______E

  This displays the days of the week that a segment will be ran with each day seperated by a '/ '.   
  For
  


* 60 

  This is the duration of the segment.
* 34/38/44/4

  These numbers denote the start time of the segment corresponding to the days found in the above.  
  To get the 24H represention of these times you must divide the value by 2. For example 34 will   
  correspond to the ' _M_____/ ', so this segment will play at 5PM on a Monday. 
* Programming Segment "Ether in the Attic"

  This last portion of notable content displays the segment name, start time and length.

### Single Calendar Mode

### Multi-Calendar Mode

## References
- [Radiologik DJ/Scheduler Help](https://macinmind.com/Help/Radiologik/)
- [iCalendar.org](https://icalendar.org/)
- [iCalendar Validator](https://icalendar.org/validator.html)
- [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545)
