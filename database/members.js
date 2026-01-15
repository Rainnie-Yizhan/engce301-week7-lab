const db = require('./connection');

class MemberDatabase {
    // ดึงข้อมูลสมาชิกทั้งหมด
    static findAll() {
        const sql = 'SELECT * FROM members ORDER BY id DESC';
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ค้นหาสมาชิกด้วย ID
    static findById(id) {
        const sql = 'SELECT * FROM members WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // ค้นหาด้วยอีเมล (ใช้ตรวจสอบความซ้ำซ้อน)
    static findByEmail(email) {
        const sql = 'SELECT * FROM members WHERE email = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // เพิ่มสมาชิกใหม่
    static create(memberData) {
        const { name, email, phone } = memberData;
        const sql = `
            INSERT INTO members (name, email, phone, status, membership_date)
            VALUES (?, ?, ?, 'Active', CURRENT_DATE)
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [name, email, phone], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }

    // อัปเดตข้อมูลสมาชิก
    static update(id, memberData) {
        const { name, email, phone, status } = memberData;
        const sql = `
            UPDATE members 
            SET name = ?, email = ?, phone = ?, status = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [name, email, phone, status, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = MemberDatabase;