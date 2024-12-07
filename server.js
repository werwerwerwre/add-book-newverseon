const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Створюємо додаток Express
const app = express();
const port = 3000;

// Налаштування для збереження файлів (обкладинок книг)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Налаштування підключення до MS SQL
const config = {
    user: 'yourUsername', // Ваша назва користувача
    password: 'yourPassword', // Ваш пароль
    server: 'yourServer', // Адреса сервера
    database: 'BookSharing', // Назва вашої бази даних
    options: {
        encrypt: true, // Потрібно для Azure, якщо не Azure можна поставити false
        trustServerCertificate: true // Для безпечного з'єднання
    }
};

// Підключення до MS SQL
sql.connect(config).then(pool => {
    // Маршрут для отримання всіх книг
    app.get('/getBooks', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Books');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Маршрут для отримання конкретної книги
    app.get('/getBook', async (req, res) => {
        const bookId = req.query.bookId;
        try {
            const result = await pool.request()
                .input('bookId', sql.Int, bookId)
                .query('SELECT * FROM Books WHERE BookID = @bookId');
            res.json(result.recordset[0]);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Маршрут для додавання книги
    app.post('/addBook', upload.single('coverImage'), async (req, res) => {
        const { title, content, authorId } = req.body;
        const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

        try {
            await pool.request()
                .input('title', sql.VarChar, title)
                .input('content', sql.Text, content)
                .input('authorId', sql.Int, authorId)
                .input('coverImage', sql.VarChar, coverImage)
                .query(`
                    INSERT INTO Books (Title, Content, AuthorID, CoverImage)
                    VALUES (@title, @content, @authorId, @coverImage)
                `);
            res.json({ success: true });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Маршрут для входу (створення користувача)
    app.get('/login', async (req, res) => {
        const nickname = req.query.nickname;
        try {
            const result = await pool.request()
                .input('nickname', sql.VarChar, nickname)
                .query('SELECT * FROM Users WHERE Nickname = @nickname');

            if (result.recordset.length > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Запуск сервера
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error connecting to the database', err.message);
});
