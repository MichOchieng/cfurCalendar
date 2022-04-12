from icalendar import Calendar, Event
from datetime  import datetime
from PyQt6.QtWidgets import QApplication, QWidget, QMainWindow,QPushButton

import sys
import re

# Scan specific dir for schedule files
# For each file
    #  If the playlist is active this week create an event
    #  Other wise skip it

# Classes

class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("CFUR Calendar")
        button = QPushButton("CLick!")

        self.setCentralWidget(button) # Place widget in mainWindow

app = QApplication([]) # Wont be using Command line args so passing []

window = MainWindow()
window.show() # Hidden by default

app.exec() # Start event loop
# Code from here on wont be executed until the window is closed
