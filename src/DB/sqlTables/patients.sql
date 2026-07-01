CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,   
    full_name VARCHAR(100) NOT NULL,            
    id_number VARCHAR(20) NOT NULL UNIQUE,      
    admission_date DATE,                      
    disease_type VARCHAR(100),                   
    nurse_number INT,
    comments TEXT,
    bed_id INT                            
    FOREIGN KEY (nurse_number) REFERENCES nurse(nurse_number) ON DELETE CASCADE
);