const express = require('express')
const router = express.Router()
const { create, list, update, remove } = require('../controllers/category')
const { authCheck, adminCheck } = require('../middlewares/authCheck')


// Admin
// @Endpoint http://localhost:5000/api/category
router.post('/', authCheck, adminCheck, create)
router.get('/', authCheck, adminCheck, list)
router.put('/:id', authCheck, adminCheck, update)
router.delete('/:id', authCheck, adminCheck, remove)



module.exports = router // ส่งออก router ไปใช้ไฟล์อื่น