-- Users
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



-- Events
CREATE OR REPLACE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,                      -- Primary key
    title VARCHAR(200) NOT NULL,                            -- Event title
    description TEXT,                                       -- Event description
    date TIMESTAMP NOT NULL,                                -- Event date and time
    location VARCHAR(255),                                  -- Event location
    created_by INT,                                         -- User who created the event
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Creation timestamp

    CONSTRAINT fk_events_user
        FOREIGN KEY (created_by) 
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;



-- Tickets
CREATE OR REPLACE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,                      -- Primary key
    event_id INT,                                           -- Related event ID
    user_id INT,                                            -- Related user ID
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Purchase timestamp
    quantity INT NOT NULL,                                  -- Number of tickets purchased

    CONSTRAINT fk_tickets_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_tickets_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;