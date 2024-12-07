// Завантажуємо список книг на головну сторінку
window.onload = function() {
    fetch('/getBooks')
        .then(response => response.json())
        .then(books => {
            let bookList = document.getElementById('book-list');
            books.forEach(book => {
                let bookItem = document.createElement('div');
                bookItem.className = 'book-item';
                bookItem.innerHTML = `
                    <img src="${book.coverImage}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <button onclick="viewBook(${book.bookId})">Переглянути</button>
                `;
                bookList.appendChild(bookItem);
            });
        });
};

function viewBook(bookId) {
    window.location.href = `viewBook.html?bookId=${bookId}`;
}

