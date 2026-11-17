CREATE DATABASE IF NOT EXISTS contact_management;
USE contact_management;

CREATE TABLE IF NOT EXISTS contacts (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(120) NOT NULL,
    PRIMARY KEY (id)
);

-- Optional sample records for testing. Remove comment markers to insert them.
-- INSERT INTO contacts (name, phone, email) VALUES
-- ('Rahul Kumar', '9876543210', 'rahul@example.com'),
-- ('Priya Sharma', '9876501234', 'priya@example.com');
