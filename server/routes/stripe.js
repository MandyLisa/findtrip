const express = require('express')
const router = express.Router()

// import module ที่เราเรียกใช้
const { authCheck }  = require('../middlewares/authCheck') // ตรวจสอบการเข้าสู่ระบบก่อน
const { createStripePayment, stripeCheckoutStatus } = require('../controllers/stripe')
  

router.post('/user/create-checkout-session', authCheck, createStripePayment) 
router.post('/user/checkout-status/:sessionId', authCheck, stripeCheckoutStatus) 

module.exports = router