const db = require('./connection');

class BorrowingDatabase {
    // ค้นหาการยืมด้วย ID
    static findById(id) {
        const sql = 'SELECT * FROM borrowings WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // ค้นหารายการยืมของสมาชิก (สำหรับเช็คจำนวนที่ยืมค้างอยู่)
    static findByMember(memberId) {
        const sql = 'SELECT * FROM borrowings WHERE member_id = ? AND status = "Borrowed"';
        return new Promise((resolve, reject) => {
            db.all(sql, [memberId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // บันทึกการยืมหนังสือใหม่
    static create(data) {
        const { book_id, member_id, borrow_date, due_date } = data;
        const sql = `
            INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, status)
            VALUES (?, ?, ?, ?, 'Borrowed')
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [book_id, member_id, borrow_date, due_date], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }

    // อัปเดตสถานะเมื่อคืนหนังสือ (ใส่ return_date)
    static updateStatus(id, data) {
        const { return_date, status } = data;
        const sql = `
            UPDATE borrowings 
            SET return_date = ?, status = ? 
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [return_date, status, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // ค้นหาการยืมที่เกินกำหนด (Overdue)
    static findOverdue(today) {
        const sql = `
            SELECT br.*, b.title, m.name 
            FROM borrowings br
            JOIN books b ON br.book_id = b.id
            JOIN members m ON br.member_id = m.id
            WHERE br.due_date < ? AND br.status = 'Borrowed'
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [today], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM borrowings`;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
}

module.exports = BorrowingDatabase;