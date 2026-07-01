CREATE TABLE beds (

    bed_id INT AUTO_INCREMENT PRIMARY KEY,   
    status ENUM('פנוי', 'תפוס') NOT NULL,    
    patient_id INT NULL,
    nurse_number INT NOT NULL                
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);