from cProfile import label
from calendar import calendar
from icalendar import Calendar, Event
from datetime  import datetime
from PyQt6.QtCore    import QSize, Qt
from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton, QLineEdit, QLabel, QVBoxLayout, QWidget

import sys
import re

# Classes

class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()

        #  Window Attributes
        self.setWindowTitle("CFUR Calendar")
        self.setFixedSize(QSize(600,750)) 
        # Add min max sizes later?

        calendar = CalendarCreator()

        # Widgets
        self.button = QPushButton("Click!")
        self.button.clicked.connect(self.buttonClicked)

        self.label = QLabel("CFUR Calendar")
        labelFont  = self.label.font()
        labelFont.setPointSize(30)
        self.label.setFont(labelFont)
        self.label.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter)

        self.mainInput = QLineEdit()
        self.mainInput.setPlaceholderText("Enter Radiologik schedule folder path here")

        # Layout

        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.mainInput)

        container = QWidget()
        container.setLayout(layout)

        # Add widgets to window
        self.setCentralWidget(container)

    def buttonClicked(self):
        self.button.setText("Clicked")
        self.button.setEnabled(False)

class CalendarCreator:
    def __init__(self) -> None:
        pass

    def test(self):
        print("Hello")

app = QApplication([]) # Wont be using Command line args so passing []

window = MainWindow()
window.show() # Hidden by default

app.exec() # Start event loop
# Code from here on wont be executed until the window is closed
