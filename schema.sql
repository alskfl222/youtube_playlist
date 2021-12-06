

CREATE DATABASE IF NOT EXISTS test
CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS done (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(32) NOT NULL
) CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SELECT name FROM done;

CREATE TABLE IF NOT EXISTS users (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(180) NOT NULL
) CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO users
(name)
VALUES
('alskfl');

CREATE TABLE IF NOT EXISTS songs (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(180) NOT NULL,
    uploader varchar(180) NOT NULL,
    href varchar(32) NOT NULL,
    added_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted tinyint(1) NOT NULL DEFAULT 0
) CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SELECT name, uploader, href
FROM songs

INSERT INTO songs
(name, uploader, href)
VALUES
("{row[0]}", "{row[1]}", "{row[2]}")

INSERT INTO done
(name)
VALUES
("{year}-{month}")