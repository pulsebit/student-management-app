const router = require('express').Router()
const requiredAuth = require('../middleware')
const PaymentList = require('../models/PaymentList.model')
var ObjectId = require('mongoose').Types.ObjectId; 

router.use(requiredAuth)

router.get('/byStudent/:studentId', (req, res) => {
  const {studentId} = req.params
  PaymentList.find({studentId: new ObjectId(studentId)}, (err, paymentLists) => {
    if (err) return res.sendStatus(500)
    res.send(paymentLists)
  })
    .sort({ dueDate: 1 })
})

router.get('/byPaymentId/:paymentId', (req, res) => {
  PaymentList.findById(req.params.paymentId, (err, paymentList) => {
    if (err) return res.sendStatus(500)
    res.send(paymentList)
  })
})

router.post('/update', (req, res) => {
  const {notes, paymentId, userId, amount, currency, dueDate, status, datePaid} = req.body
  PaymentList.findByIdAndUpdate(paymentId, {
    notes,
    editedBy: userId,
    amount, currency, 
    dueDate,
    status,
    datePaid,
  }, (err, updated) => {
    if (err) return res.sendStatus(500)
    res.send(updated)
  })
})

module.exports = router