const BorrowingDB = require('../database/borrowings');
const BookDB = require('../database/books');
const MemberDB = require('../database/members');

class BorrowingService {
    // ===== BORROW BOOK =====
    static async borrowBook(borrowData) {
        try {
            const { book_id, member_id } = borrowData;

            // 1. ตรวจสอบหนังสือและเล่มว่าง
            const book = await BookDB.findById(book_id);
            if (!book) throw new Error('ไม่พบหนังสือในระบบ');
            if (book.available_copies <= 0) throw new Error('No available copies');

            // 2. ตรวจสอบสถานะสมาชิก
            const member = await MemberDB.findById(member_id);
            if (!member) throw new Error('ไม่พบข้อมูลสมาชิก');
            if (member.status !== 'Active') throw new Error('สมาชิกภาพของคุณไม่ได้อยู่ในสถานะปกติ');

            // 3. ตรวจสอบโควตาการยืม (ไม่เกิน 3 เล่ม)
            const currentBorrowing = await BorrowingDB.findByMember(member_id);
            const activeBorrows = currentBorrowing.filter(b => b.status === 'Borrowed');
            if (activeBorrows.length >= 3) throw new Error('คุณยืมหนังสือครบกำหนด 3 เล่มแล้ว');

            // 4. คำนวณวันกำหนดส่ง (14 วัน)
            const borrowDate = new Date();
            const dueDate = new Date();
            dueDate.setDate(borrowDate.getDate() + 14);

            const borrowDateStr = borrowDate.toISOString().split('T')[0];
            const dueDateStr = dueDate.toISOString().split('T')[0];

            // 5. บันทึกข้อมูลและลดจำนวนหนังสือ
            const result = await BorrowingDB.create({
                book_id,
                member_id,
                borrow_date: borrowDateStr,
                due_date: dueDateStr
            });

            await BookDB.decreaseAvailableCopies(book_id);

            // 6. ส่งกลับข้อมูลตาม Test Case
            return {
                success: true,
                message: "Book borrowed successfully",
                data: {
                    id: result.id,
                    book_id: book.id,
                    book_title: book.title,
                    member_id: member.id,
                    member_name: member.name,
                    borrow_date: borrowDateStr,
                    due_date: dueDateStr,
                    status: "borrowed"
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // ===== RETURN BOOK =====
    // services/borrowing.service.js
static async returnBook(borrowingId) {
    // 1. หาข้อมูลการยืม
    const borrowing = await BorrowingDB.findById(borrowingId);
    if (!borrowing) throw new Error('Borrowing record not found');
    if (borrowing.status === 'returned') throw new Error('This book has already been returned');

    // 2. คำนวณค่าปรับ (กรณีเกิน 14 วัน)
    const today = new Date();
    const dueDate = new Date(borrowing.due_date);
    let fine = 0;
    let daysOverdue = 0;

    if (today > dueDate) {
        const diffTime = Math.abs(today - dueDate);
        daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fine = daysOverdue * 20; // ค่าปรับวันละ 20 บาท
    }

    // 3. อัปเดตข้อมูลการคืนใน Database
    const returnDateStr = today.toISOString().split('T')[0];
    await BorrowingDB.updateStatus(borrowingId, {
        return_date: returnDateStr,
        status: 'Returned'
    });

    // 4. เพิ่มจำนวนหนังสือคืนเข้าสต็อก (+1)
    await BookDB.increaseAvailableCopies(borrowing.book_id);

    return {
        id: borrowing.id,
        return_date: returnDateStr,
        days_overdue: daysOverdue,
        fine: fine
    };
}
    // ===== GET OVERDUE =====
    static async getOverdueBorrowings() {
        try {
            const today = new Date().toISOString().split('T')[0];
            return await BorrowingDB.findOverdue(today);
        } catch (error) {
            throw error;
        }
    }
    // 1. เพิ่มฟังก์ชันดึงรายการยืมทั้งหมด
    static async getAllBorrowings() {
        try {
            return await BorrowingDB.findAll(); 
        } catch (error) {
            throw error;
        }
    }

    // 2. เพิ่มฟังก์ชันดึงตาม ID
    static async getBorrowingById(id) {
        try {
            const result = await BorrowingDB.findById(id);
            if (!result) throw new Error('Borrowing record not found');
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 3. เพิ่มฟังก์ชันดึงตามสมาชิก
    static async getBorrowsByMember(memberId) {
        try {
            return await BorrowingDB.findByMember(memberId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BorrowingService;