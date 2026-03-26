-- Values for users
INSERT INTO users (username, name, surname, password, email, user_type, enabled, gender) VALUES
    ('user1', 'Nombre1', 'Apellido1', SHA2('1234', 512), 'correo1@email.com', 'admin',       1, 'male'),
    ('user2', 'Nombre2', 'Apellido1', SHA2('1234', 512), 'correo2@email.com', 'sponsor',     1, 'female'),
    ('user3', 'Nombre3', 'Apellido1', SHA2('1234', 512), 'correo3@email.com', 'organizer',   1, 'unknown');



-- Values for events
INSERT INTO events (title, description, date, location, created_by) VALUES
    ('Concierto I', 'Concierto en Madrid', '2026-06-15 09:00:00', 'Madrid, Spain', 3),
    ('Concierto II', 'Concierto en Barcelona', '2026-07-20 18:00:00', 'Barcelona, Spain', 3),
    ('Concierto III', 'Concierto en Valencia', '2026-05-10 19:30:00', 'Valencia, Spain', 3);



-- Values for tickets
INSERT INTO tickets (event_id, user_id, quantity) VALUES
    (1, 2, 2),   -- User 2 buys 2 tickets for event 1
    (1, 3, 1),   -- User 3 buys 1 ticket for event 1
    (2, 1, 4),   -- User 1 buys 4 tickets for event 2
    (2, 3, 2),   -- User 3 buys 2 tickets for event 2
    (2, 2, 1);   -- User 2 buys 1 ticket for event 2


-- Query
SELECT id, username, name, surname, email, user_type, enabled, gender, create_at, update_at, delete_at FROM users;
SELECT id, title, description, date, location, created_by FROM events;
SELECT id, event_id, user_id, purchase_date, quantity FROM tickets;