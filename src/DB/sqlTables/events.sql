CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,    
    patient_id INT NOT NULL,                    
    event_date DATE,                          
    end_time TIME,                              
    nurse_number INT,                              

    status ENUM('טופל', 'מטופל', 'ממתין לטיפול'), 
    event_type VARCHAR(100),                  

    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (nurse_number) REFERENCES nurse(nurse_number)
);