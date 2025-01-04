CREATE DATABASE database_mcnair;
USE database_mcnair;

CREATE TABLE users(
	user_id int auto_increment,
    username varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    user_type ENUM('student', 'admin') NOT NULL,
    primary key (user_id)
    );

CREATE TABLE user_progress (
	progress_id int auto_increment,
    user_id INT NOT NULL,
    level_id INT NOT NULL,
    challenge_id INT NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    score INT NOT NULL DEFAULT 0,
    completed_progress BOOLEAN NOT NULL DEFAULT FALSE,
    completion_time TIME NOT NULL DEFAULT '00:00:00',
    completed_at_time TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (progress_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (level_id) REFERENCES levels(level_id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id)
);    

CREATE TABLE levels (
	level_id INT auto_increment,
    level_name VARCHAR(255) NOT NULL,
    level_description TEXT NOT NULL,
    PRIMARY KEY (level_id)
);

CREATE TABLE challenges (
	challenge_id INT auto_increment,
    challenge_title VARCHAR(255) NOT NULL,
    challenge_criteria TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    level_id INT NOT NULL,
    PRIMARY KEY (challenge_id),
    FOREIGN KEY (level_id) REFERENCES levels(level_id)
);

CREATE TABLE leaderboard (
	leaderboard_id int auto_increment,
    leaderboard_rank INT NOT NULL,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    level_id INT NOT NULL,
    PRIMARY KEY (leaderboard_id),
    foreign key (user_id) REFERENCES users(user_id),
    FOREIGN KEY (level_id) REFERENCES levels(level_id)
);

    