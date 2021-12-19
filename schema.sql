CREATE DATABASE IF NOT EXISTS test
CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

USE test;

CREATE TABLE IF NOT EXISTS field (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    table_name varchar(32) NOT NULL,
    fields varchar(180) NOT NULL
) CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS user (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(180) NOT NULL,
    email varchar(180)
) CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS song (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(180) NOT NULL,
    uploader varchar(180) NOT NULL,
    href varchar(64) NOT NULL,
    added_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted tinyint(1) NOT NULL DEFAULT 0
) CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS list (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(180) NOT NULL,
    user_id int NOT NULL,
    href varchar(64) NOT NULL,
    added_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted tinyint(1) NOT NULL DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE CASCADE
) CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS user_list (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    list_id int NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE CASCADE,
    FOREIGN KEY (list_id) REFERENCES list (id) ON UPDATE CASCADE
) CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS song_list (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    song_id int NOT NULL,
    list_id int NOT NULL,

    FOREIGN KEY (song_id) REFERENCES user (id) ON UPDATE CASCADE,
    FOREIGN KEY (list_id) REFERENCES list (id) ON UPDATE CASCADE
) CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;