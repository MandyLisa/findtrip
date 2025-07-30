const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/authCheck'); // ตรวจสอบสิทธิ์
const { listUsers, listUserRole, getProfileById, updateUserRole, changeUserStatus } = require('../controllers/admin');


// Admin 
// จัดการผู้ใช้ (User Management)
router.get('/users', authCheck, adminCheck, listUsers); // ดูรายการผู้ใช้ทั้งหมด
router.get('/users/role-list', authCheck, adminCheck, listUserRole); // drop down
router.get('/users/:id', authCheck, adminCheck, getProfileById); // drop down

router.put('/users/role/:id', authCheck, adminCheck, updateUserRole); // เปลี่ยน role ของ user
router.put('/users/:id/status', authCheck, adminCheck, changeUserStatus); // เปลี่ยน status ของ user


module.exports = router;
