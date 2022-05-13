from icalendar import Calendar, Event
from datetime  import date, datetime, timedelta
from PyQt6.QtCore    import QSize, Qt, QRect
from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton, QLineEdit, QLabel, QVBoxLayout, QWidget, QScrollArea

import os
import re

# Classes
class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()

        #  Window Attributes
        self.setWindowTitle("Radiologik Calendar")
        self.setFixedSize(QSize(600,750)) 
        # Add min max sizes later?
        

        # Widgets
        self.label = QLabel("Radiologik Calendar")
        labelFont  = self.label.font()
        labelFont.setPointSize(30)
        self.label.setFont(labelFont)
        self.label.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter)
        self.label.setMaximumHeight(50)

        self.mainInput = QLineEdit()
        self.mainInput.setText("/Documents/cfur/cfurCalendar")
        self.mainInput.setPlaceholderText("Default path is /Music/Radiologik/Schedule/")
    

        self.submitBtn = QPushButton("Generate calendar")
        self.submitBtn.clicked.connect(self.buttonClicked)
        self.submitBtn.setMinimumHeight(50)

        self.terminal = Terminal(self)
        self.terminal.setMaximumHeight(200)

        # Layout
        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.mainInput)
        layout.addWidget(self.submitBtn)
        layout.addWidget(self.terminal)

        container = QWidget()
        container.setLayout(layout)

        # Add widgets to window
        self.setCentralWidget(container)

    def buttonClicked(self):
        # Refresh terminal 
        self.terminal.setText("")

        # Check to see if there is a directory entered in main input
        #   True -> create parser object and run
        #   False -> print error to terminal
        if self.mainInput.text() != "":
            parser = Parser(self.mainInput.text(),self.terminal)
            # Get file names
            if parser.getFileNames():
                self.terminal.setText("Found scheduler files in '" + self.mainInput.text() + "'")
                # Create Calendar from files
                parser.run()
            else:
                self.terminal.setText("Could not find scheduler files in the directory '" + self.mainInput.text() + "'" )
            
            # Return Calendar
        else: 
            self.terminal.setText("Please enter the directory containing Radiologik schedule files in the input field.")

        # # Will be used to update terminal later
        # temp = self.terminal.text() + "\n"

# Used for output terminal
class Terminal(QScrollArea):
    def __init__(self,*args,**kwargs) -> None:
        QScrollArea.__init__(self,*args,**kwargs)
        
        self.setWidgetResizable(True)

        content = QWidget(self)
        self.setWidget(content)

        layout = QVBoxLayout(content)
        
        self.label = QLabel(content)

        self.label.setAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignTop)

        self.label.setWordWrap(True) # Allows for multiline

        layout.addWidget(self.label)
    # Overridden Functions
    def setText(self,txt):
        self.label.setText(txt)

    def text(self) -> str:
        return self.label.text()

class Parser:
    TERMINAL = Terminal
    DIR      = str
    FILES    = []
    CAL      = Calendar()
    EVENT_LIST = [Event]
    TODAY    = datetime.date(datetime.now())
    SUNDAY   = datetime.combine(
        (
            TODAY - timedelta(days=TODAY.weekday()+1)), # Date
            datetime.min.time()                         # Time
        )

    def __init__(self,dir,terminal:Terminal) -> None:
        self.DIR      = dir
        self.TERMINAL = terminal

    def getFileNames(self) -> bool:
        # Scan directory for schedulue files with the following naming convention
        # File#whitespace-whitespace
        try:
            for file in os.listdir(os.path.expanduser('~' + self.DIR)):
                if re.search("[0-9][0-9][0-9]\s-\s",file):
                    self.FILES.append(file)
            self.printToTerminal(str(self.FILES))
        except FileNotFoundError:
            return False
        
        if len(self.FILES) > 0: 
            return True
        else:
            return False

  # Allows print statements to go strait to the MainWindow class terminal
    def printToTerminal(self,string):
        temp = self.TERMINAL.text() + "\n"
        self.TERMINAL.setText(temp + str(string))

    def readFile(self,file:str):
        self.printToTerminal("Reading file " + file + "...")
        """
        # Open file
        # Retrieve following attributes
        #   - Title
        #   - Start time
        #   - End time
        #   - Scheduled day
        """

        """
        File structure

        Radiologik Schedule Segment
        _______/         = Day Played (SMTWTFS)
        60 (or some int) = Duration
        24/24            = (24h) time being played *2
        """
        
        with open(file,'r',encoding='utf-8',errors='ignore') as f:
            lines = f.readlines()

        days       = []
        duration   = int
        startTimes = []
        eventName  = str

        for i,line in enumerate(lines):
            if i == 23: # Avoids going through lines that wont be used
                break
            # Scheduled days
            if i == 1:
                regex = re.compile('[^a-zA-Z]')
                # Split into an array
                days = re.split("/",line)
                # Determine the correct days and remove '_'
                for i,val in enumerate(days):
                    if val[0] == 'S':
                        days[i] = 'Su'
                    elif val[2] == 'T':
                        days[i] = 'Tu'
                    elif val[4] == 'S':
                        days[i] = 'Sa'
                    elif val[6] == 'T':
                        days[i] = 'Th'
                    else:
                        # Only keep alphabetic chars
                        days[i] = regex.sub('',days[i])
            # Duration
            elif i == 2:
                duration = int(
                                line.replace(" \n","")
                            )
            # Start time
            elif i == 5:
                # Split into array
                startTimes = re.split("/",line)
                for i,val in enumerate(startTimes):
                    # Cast into ints
                    startTimes[i] = int(startTimes[i]) / 2
            # Event name
            elif i == 22:
                # Strip start of the line
                temp     = line[43:]
                # Put everything in quotation marks in a list and grab the first occurance
                eventName = re.findall('"([^"]*?)"',temp)[0]

        # Create a list of tuples that has events day and time
        eventTimes = []
        for i,val in enumerate(days):
            # Filters out unused data
            if val != '':
                eventTimes.append((days[i],startTimes[i]))
                
        self.createEvents(eventTimes,eventName,duration)
        self.createFile()
        

    def createEvents(self, evntTimes:tuple, title:str, duration:int):
        self.printToTerminal("Creating calendar event for " + title + "...")
        """
        Events consist of:
            - Start time
            - End time
            - Summary/title
        """

        for val in evntTimes:
            startDT = self.calculateDelta(val)
            endDT   = startDT + timedelta(minutes=duration)
            self.printToTerminal(str(startDT))
            event = Event()
            event.add('dtstart',startDT)
            event.add('dtend',endDT)
            event.add('summary',title)
            self.CAL.add_component(event)
            # self.printToTerminal("Start: " + str(startDT))
            # self.printToTerminal("End: " + str(endDT))

        
    
    def calculateDelta(self,dt:tuple) -> datetime:
        # Determine the incoming day
        #   Add (if needed) days to start of the week
        # Add time to complete datetime
        if (dt[0] == 'Su'):
            return self.SUNDAY
        elif (dt[0] == 'M'):
            return self.SUNDAY + timedelta(days=1,minutes=(dt[1] * 60))
        elif (dt[0] == 'Tu'):
            return self.SUNDAY + timedelta(days=2,minutes=(dt[1] * 60))
        elif (dt[0] == 'W'):
            return self.SUNDAY + timedelta(days=3,minutes=(dt[1] * 60))
        elif (dt[0] == 'Th'):
            return self.SUNDAY + timedelta(days=4,minutes=(dt[1] * 60))
        elif (dt[0] == 'F'):
            return self.SUNDAY + timedelta(days=5,minutes=(dt[1] * 60))
        elif (dt[0] == 'Sa'):
            return self.SUNDAY + timedelta(days=6,minutes=(dt[1] * 60))
        
    def createFile(self):
        f = open("cfurCal.ical", "wb")
        f.write(self.CAL.to_ical())
        f.close()

    def run(self):
        for file in self.FILES:
            self.readFile(file)

app = QApplication([])
window = MainWindow()
window.show()
app.exec()
