CREATE TABLE users (
    userID SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwordHash VARCHAR(100) NOT NULL
);

CREATE TABLE contacts (
    contactID SERIAL PRIMARY KEY,
    contactName VARCHAR(50) UNIQUE NOT NULL,
    phoneNum VARCHAR(50) NOT NULL,
    userID INTEGER NOT NULL,
    FOREIGN KEY (userID) REFERENCES user (userID)
);

