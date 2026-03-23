-- Schema
CREATE OR REPLACE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,                      -- Primary value
    username VARCHAR(300) UNIQUE,                           -- Username, unique value
    name VARCHAR(300),                                      -- Name
    surname VARCHAR(300),                                   -- Surname
    password CHAR(128),                                     -- Password, in SHA2 512
    email VARCHAR(300) NOT NULL UNIQUE,                     -- User email
    user_type VARCHAR(200),                                 -- Type of user
    enabled BOOLEAN DEFAULT 0,                              -- Enabled state
    gender ENUM('male', 'female', 'unknown'),               -- Gender (if null, it is considered unknown)
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Creation date
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Modification date
    delete_at TIMESTAMP NULL DEFAULT NULL,                  -- Delete date
    country_code CHAR(2),                                   -- ISO 3166 (ES, US, FR...)
    city VARCHAR(200),                                      -- City
    postal_code VARCHAR(20),                                -- Postal code
    latitude DECIMAL(9,6),                                  -- Latitude
    longitude DECIMAL(9,6)                                  -- Longitude
) ENGINE=InnoDB;

-- Values
INSERT INTO users (username, name, surname, password, email, user_type, enabled, gender, create_at, update_at) VALUES
    ('user1', 'Nombre1', 'Apellido1', SHA2('1234', 512), 'correo1@email.com', 'admin',       1, 'male',     NOW(), NOW()),
    ('user2', 'Nombre2', 'Apellido1', SHA2('1234', 512), 'correo2@email.com', 'sponsor',     1, 'female',   NOW(), NOW()),
    ('user3', 'Nombre3', 'Apellido1', SHA2('1234', 512), 'correo3@email.com', 'organizer',   1, 'unknown',  NOW(), NOW());

-- Query
SELECT id,
    username,
    name, surname,
    email, user_type, enabled, gender,
    create_at, update_at, delete_at
FROM users;