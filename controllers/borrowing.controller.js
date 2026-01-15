const BorrowingService = require('../services/borrowing.service');

class BorrowingController {
    // 1. ส่วนของการยืม (POST /api/borrowings)
    static async borrow(req, res, next) {
        try {
            const result = await BorrowingService.borrowBook(req.body);
            res.status(201).json(result);
        } catch (error) {
            // แก้ไขตรงนี้ให้มี success: false
            res.status(400).json({
                success: false,
                error: error.message 
            });
        }
    }

    // 2. ส่วนของการคืน (POST /api/borrowings/return/:id)
    // controllers/borrowing.controller.js
static async return(req, res) {
    try {
        const { id } = req.params;
        const result = await BorrowingService.returnBook(id);
        
        // คืนค่าสำเร็จพร้อมค่าปรับ (ถ้ามี)
        res.status(200).json({
            success: true,
            message: "Book returned successfully",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message 
        });
    }
}

// 1. เพิ่มฟังก์ชันสำหรับดูรายการเกินกำหนด (Overdue)
    static async getOverdue(req, res) {
        try {
            const results = await BorrowingService.getOverdueBorrowings();
            res.status(200).json({ success: true, data: results });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // 2. เพิ่มฟังก์ชันสำหรับดึงข้อมูลตามสมาชิก (getByMember)
    static async getByMember(req, res) {
        try {
            const { memberId } = req.params;
            const results = await BorrowingService.getBorrowsByMember(memberId);
            res.status(200).json({ success: true, data: results });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const results = await BorrowingService.getAllBorrowings();
            res.status(200).json({ success: true, data: results });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // 4. เพิ่มฟังก์ชันดึงรายการตาม ID (ตาม Route บรรทัดที่ 21)
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await BorrowingService.getBorrowingById(id);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    
}


module.exports = BorrowingController;