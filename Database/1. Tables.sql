-- Schema
CREATE TABLE users (
    username VARCHAR(300) PRIMARY KEY,                      -- Username, primary value
    name VARCHAR(300),                                      -- Name
    surname VARCHAR(300),                                   -- Surname
    password CHAR(128),                                     -- Password, in SHA2 512
    email VARCHAR(300),                                     -- User email
    user_type VARCHAR(200),                                 -- Type of user
    enabled BOOLEAN DEFAULT 0,                              -- Enabled state
    gender ENUM('male', 'female', 'unknown'),               -- Gender (if null, it is considered unknown)
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,  -- Creation date
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL   -- Modification date
) ENGINE=InnoDB;

-- Users
INSERT INTO users VALUES
    ('user1', 'Nombre1', 'Apellido1', SHA2('1234', 512), 'correo1@email.com', 'admin',       1, 'male',     NOW(), NOW()),
    ('user2', 'Nombre2', 'Apellido1', SHA2('1234', 512), 'correo2@email.com', 'sponsor',     1, 'female',   NOW(), NOW()),
    ('user3', 'Nombre3', 'Apellido1', SHA2('1234', 512), 'correo3@email.com', 'organizer',   1, 'unknown',  NOW(), NOW());
