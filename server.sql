-- Створення бази даних
CREATE DATABASE BookSharing;

-- Використовуємо базу даних
USE BookSharing;

-- Таблиця користувачів
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY,
    Nickname VARCHAR(100) NOT NULL
);

-- Таблиця книг
CREATE TABLE Books (
    BookID INT PRIMARY KEY IDENTITY,
    Title VARCHAR(200) NOT NULL,
    Content TEXT NOT NULL,
    AuthorID INT,
    CoverImage VARCHAR(255),
    FOREIGN KEY (AuthorID) REFERENCES Users(UserID)
);
