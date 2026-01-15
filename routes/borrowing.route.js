const express = require('express');
const router = express.Router();
const BorrowingController = require('../controllers/borrowing.controller');

// 1. ดึงรายการยืมทั้งหมด
router.get('/', BorrowingController.getAll);

// 2. รายการเกินกำหนด (ต้องวางไว้ก่อนที่มี /:id)
router.get('/overdue', BorrowingController.getOverdue);

// 3. ยืมหนังสือ (POST)
router.post('/borrow', BorrowingController.borrow);

// 4. ตามสมาชิก
router.get('/member/:memberId', BorrowingController.getByMember);

// 5. คืนหนังสือ (PUT) - เปลี่ยนตามโจทย์ที่คุณต้องการ :id/return
router.put('/:id/return', BorrowingController.return);

// 6. ตาม ID (ต้องวางไว้ท้ายสุดของตระกูล GET)
router.get('/:id', BorrowingController.getById);

module.exports = router;