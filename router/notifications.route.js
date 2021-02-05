const router = require('express').Router()
const requiredAuth = require('../middleware')
const Student = require('../models/Student.model')
const Notification = require('../models/Notification.model')
const PaymentList = require('../models/PaymentList.model')
const PaymentPlanByStudent = require('../models/PaymentPlanByStudent.model')

var date = new Date()
const now = date.toISOString().slice(0,-14)
const dateMinus7 = date.setDate(date.getDate() - 7)
const dateMinus7ISO = new Date(dateMinus7).toISOString().slice(0, -14)

router.use(requiredAuth)

router.get('/lists', (req, res) => {
  PaymentList.find({ dueDate: {
      $lte: new Date(now).toISOString(),
      $gte: new Date(dateMinus7ISO).toISOString(),
    } 
  }, (err, result) => {
    if (err) return res.sendStatus(500)
    res.send(result)
  }).sort({ dueDate: -1 })

})

router.get('/filter', (req, res) => {
  Student.find(
    {
      'paymentBreakdown.dueDate':  {
        $lte: new Date(now).toISOString()
      },
    }, 
    (err, result) => {
      if (result) {
        res.send(result)
      } 
  }).sort({ createdAt: -1 })
})

router.post('/create', (req, res) => {
  const {data} = req.body
  data.forEach(item => {
    Notification.findOne({ paymentId: item._id }, (err, result) => {
      if (!result) {
        new Notification({ 
          paymentId: item._id, 
          read: false,
          type: 'paymentDue',
          text: 'Payment Due',
          status: item.status,
          fullName: item.firstName + ' ' + item.lastName,
          dueDate: item.dueDate,
        }).save()
      }
    })
  })
  res.send('Saved Notifications.')
})

router.get('/student/:studentId', (req, res) => {
  const {studentId} = req.params
  Student.findById(studentId, (err, student) => {
    if (student) {
      res.send(`${student.firstName} ${student.lastName}`)
    }
  })
})

module.exports = router