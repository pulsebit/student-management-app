const router = require('express').Router()
const requiredAuth = require('../middleware')
const PaymentList = require('../models/PaymentList.model')
var ObjectId = require('mongoose').Types.ObjectId; 

router.use(requiredAuth)

router.get('/byStudent/:studentId/planId/:paymentPlanId', (req, res) => {
  const {studentId, paymentPlanId} = req.params
  const {category} = req.query
  const paymentListModel = PaymentList.find()

  if (category === 'custom') {
    paymentListModel.find({studentId, paymentPlanId, category: 'custom' })
  } 

  if (!category) {
    paymentListModel.find({studentId, paymentPlanId, category: {$not: {$regex: 'custom'}} })
  }

  paymentListModel
    .sort({ dueDate: 1 })
    .then(paymentLists => {
      res.send(paymentLists)
    })
})

router.get('/:paymentId', (req, res) => {
  PaymentList.findById(req.params.paymentId, (req, list) => {
    res.send(list)
  })
})

router.get('/byPaymentId/:paymentId', (req, res) => {
  PaymentList.findById(req.params.paymentId, (err, paymentList) => {
    if (err) return res.sendStatus(500)
    res.send(paymentList)
  })
})

router.get('/byAllPaid/:studentId', (req, res) => {
  PaymentList.find({
    "studentId" : { "$eq": req.params.studentId },
    "status" : { "$eq": "Paid" }
    }, {amount:1, _id:0}, (err, paymentList) => {
        if (err) return res.sendStatus(500)
        console.log(paymentList);
        res.send(paymentList)
  })
})

router.post('/update', (req, res) => {
  const {notes, paymentId, userId, amount, currency, dueDate, status, datePaid} = req.body
  PaymentList.findByIdAndUpdate(paymentId, {
    notes,
    editedBy: userId,
    amount, currency, 
    dueDate: dueDate,
    status,
    datePaid,
  }, (err, updated) => {
    if (err) return res.sendStatus(500)
    res.send(updated)
  })
})

router.post('/new-additional-payment', (req, res) => {
  const {paymentData, studentId} = req.body
  new PaymentList({...paymentData, studentId})
    .save((err, saved) => {
      if (err) return res.sendStatus(500)
      res.send(saved)
    })
})

router.delete('/delete/:studentId', (req, res) => {
  const {studentId} = req.params
  PaymentList.deleteMany({ studentId }, (err, deleted) => {
    if (deleted) {
      res.send('deleted')
    }
  })
})

module.exports = router