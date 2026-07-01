CREATE TABLE shift (
    shiftNum INT PRIMARY KEY,     
    startHour DATETIME NOT NULL,   
    endHour DATETIME NOT NULL,     
    nurse_number INT NOT NULL,     
    FOREIGN KEY (nurse_number) REFERENCES nurse(nurse_number) ON DELETE CASCADE
);