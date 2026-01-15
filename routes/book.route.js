const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book.controller');

router.get('/', BookController.getAll);           // ดึงทั้งหมด
router.get('/:id', BookController.getById);       // ดึง 1 เล่ม
router.post('/', BookController.create);          // เพิ่มหนังสือ
router.put('/:id', BookController.update);        // แก้ไขหนังสือ (ต้องมีบรรทัดนี้เพื่อแก้ 404)
router.get('/search', BookController.search);     // ค้นหาหนังสือ

module.exports = router;