const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/members.controller');

// GET /api/members - ดึงรายชื่อสมาชิกทั้งหมด
router.get('/', MemberController.getAll);

// GET /api/members/:id - ดึงข้อมูลสมาชิกรายคน
router.get('/:id', MemberController.getById);

// POST /api/members - ลงทะเบียนสมาชิกใหม่
router.post('/', MemberController.register);

router.put('/:id', MemberController.update);

module.exports = router;