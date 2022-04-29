from icalendar import Calendar, Event
from datetime  import datetime
from PyQt6.QtCore    import QSize, Qt, QRect
from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton, QLineEdit, QLabel, QVBoxLayout, QWidget, QScrollArea

import os
import re

# Classes
class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()

        #  Window Attributes
        self.setWindowTitle("CFUR Calendar")
        self.setFixedSize(QSize(600,750)) 
        # Add min max sizes later?
        

        # Widgets
        self.label = QLabel("CFUR Calendar")
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
    CAL      = Calendar

    def __init__(self,dir,terminal) -> None:
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

    def readFile(self,file):
        # Open file
        # Retrieve following attributes
        #   - Title
        #   - Start time
        #   - End time
        #   - Scheduled day

        """
        File structure

        Radiologik Schedule Segment
        _______/         = Day Played (SMTWTFS)
        60 (or some int) = Duration
        24/24            = (24h) time being played *2

        """
        
        with open(file,'r',encoding='utf-8',errors='ignore') as f:
            lines = f.readlines()

        event = Event()

        days      = str
        duration  = int
        startTime = str
        evenName  = str

        for i,line in enumerate(lines):
            if i == 23: # Avoids going through lines that wont be used
                break
            # Scheduled days
            if i == 1:
                days = line.replace("_\n","")
                self.printToTerminal(days)
            # Duration
            elif i == 2:
                duration = int(
                                line.replace(" \n","")
                            )
                self.printToTerminal(str(duration))
            # Start time
            elif i == 5:
                    self.printToTerminal(line.replace("\n",""))
            # Event name
            elif i == 22:
                # Strip start of the line
                temp     = line[43:]
                evenName = re.findall('"([^"]*?)"',temp)[0]
                self.printToTerminal(evenName)
                # Pull out everything in the quotation marks
                # self.printToTerminal(line)

    def run(self):
        self.printToTerminal("Reading files...")
        for file in self.FILES:
            self.readFile(file)

app = QApplication([])
window = MainWindow()
window.show()
app.exec()
