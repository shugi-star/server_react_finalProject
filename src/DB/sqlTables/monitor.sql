CREATE TABLE monitor (
    monitor_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,       
    heart_rate INT,             
    ecg VARCHAR(50),              
    oxygen_level INT,             
    blood_pressure VARCHAR(20),   
    temperature DECIMAL(4,1),   

    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);