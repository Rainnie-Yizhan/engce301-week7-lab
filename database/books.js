const db = require('./connection');

class BookDatabase {
    // ✅ ดึงข้อมูลหนังสือทั้งหมด
    static findAll() {
        const sql = 'SELECT * FROM books ORDER BY id DESC';
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // TODO: findById - ค้นหาหนังสือด้วย ID (ใช้ db.get)
    static findById(id) {
        const sql = 'SELECT * FROM books WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // TODO: search - ค้นหาจาก title หรือ author (ใช้ LIKE)
    static search(keyword) {
        const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';
        const params = [`%${keyword}%`, `%${keyword}%`];
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // TODO: create - เพิ่มหนังสือใหม่
    static create(bookData) {
        const { title, author, isbn, category, total_copies } = bookData;
        const sql = `
            INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        // กำหนดให้ตอนเริ่ม available_copies เท่ากับ total_copies
        return new Promise((resolve, reject) => {
            db.run(sql, [title, author, isbn, category, total_copies, total_copies], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }

    // TODO: update - แก้ไขข้อมูลหนังสือ
    static update(id, bookData) {
        const { title, author, isbn, category, total_copies, available_copies } = bookData;
        const sql = `
            UPDATE books 
            SET title = ?, author = ?, isbn = ?, category = ?, total_copies = ?, available_copies = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [title, author, isbn, category, total_copies, available_copies, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // ✅ ลดจำนวนหนังสือที่ว่าง (เมื่อมีการยืม)
    static decreaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies - 1
            WHERE id = ? AND available_copies > 0
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // TODO: increaseAvailableCopies - เพิ่มจำนวนหนังสือคืน (เมื่อมีการคืน)
    static increaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies + 1
            WHERE id = ? AND available_copies < total_copies
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = BookDatabase;