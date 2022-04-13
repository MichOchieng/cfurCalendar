from icalendar import Calendar, Event
from datetime  import datetime
from PyQt6.QtCore    import QSize, Qt, QRect
from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton, QLineEdit, QLabel, QVBoxLayout, QWidget, QScrollArea

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
        self.label = QLabel("CFUR Calendar")
        labelFont  = self.label.font()
        labelFont.setPointSize(30)
        self.label.setFont(labelFont)
        self.label.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter)
        self.label.setMaximumHeight(50)

        self.mainInput = QLineEdit()
        self.mainInput.setPlaceholderText("Enter Radiologik schedule folder path here")

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
        # Will be used to update terminal later
        temp = self.terminal.text() + "\n"
        self.terminal.setText(temp + "test")

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

class CalendarCreator:
    def __init__(self) -> None:
        pass

    def test(self):
        print("Hello")

app = QApplication([])
window = MainWindow()
window.show()
app.exec()
