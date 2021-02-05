const router = require('express').Router()
const requiredAuth = require('../middleware')
const Student = require('../models/Student.model')
const PaymentList = require('../models/PaymentList.model')
const PaymentPlanByStudent = require('../models/PaymentPlanByStudent.model')
const ObjectId = require('mongoose').Types.ObjectId


router.use(requiredAuth)

router.get('/', (req, res) => {
  const {order, orderBy, name, tag, qtyOp, qtyNum, currency, paymentType, status, recurrence, paymentTypeOp, page} = req.query
  const perPage = 10

  const allStudent = Student.find()

  if (paymentType) {
    allStudent.find({
      $and: [{'payment.paymentType': {$regex: paymentType, $options: 'i'}}]
    })
  }

  if (recurrence && paymentTypeOp) {
    if (paymentTypeOp === '<=') {
      allStudent.find({
        $and: [
          {'payment.paymentTypeAmount': {$lte: recurrence}},
          {'payment.paymentType': {$regex: paymentType, $options: 'i'}}
        ],
      })
    }
    if (paymentTypeOp === '>=') {
      allStudent.find({
        $and: [
          {'payment.paymentTypeAmount': {$gte: recurrence}},
          {'payment.paymentType': {$regex: paymentType, $options: 'i'}}
        ],
      })
    }
  }

  if (qtyNum && qtyOp) {
    if (qtyOp === '<=') {
      allStudent.find({
        $and: [{'payment.quantity': {$lte: qtyNum}}]
      })
    }
    if (qtyOp === '>=') {
      allStudent.find({
        $and: [{'payment.quantity': {$gte: qtyNum}}]
      })
    }
  }

  if (order && orderBy) {
    allStudent.sort({[orderBy]: order})
  }

  if (name) {
    allStudent.find({
      $or: [
        {firstName: {$regex: name, $options: 'i'}}, 
        {lastName: {$regex: name, $options: 'i'}},
      ]
    })
  }

  if (status) {
    allStudent.find({'payment.paymentStatus': {$regex: status, $options: 'i'}})
  }

  if (currency) {
    allStudent.find({'payment.currency': {$regex: currency, $options: 'i'}})
  }

  if (tag) {
    allStudent.find({
      $and: [
        {'payment.paymentTag': {$regex: tag, $options: 'i'}},
      ]
    })
  }

  if (page) {
    allStudent.skip((parseInt(page) - 1) * perPage)
  }

  allStudent
    .limit(perPage)
    .sort({createdAt: 'asc'})
    .then(student => {
      Student.countDocuments((err, count) => {
        res.send({
          student, 
          count, 
          allDocsOfPage: perPage * (parseInt(page) || 1),
          perPage,
        })
      })
    })
  allStudent.catch(err => res.status(400).send({err}))
})


router.post('/create', (req, res) => {
  const {studentInfo, paymentInfo, paymentBreakdown} = req.body
  new Student({ ...studentInfo, paymentInfo })
        .save((err, saved) => {
          const newPaymentBreakdown = paymentBreakdown.map(item => {
            return {...item,studentId: saved._id}
          })
          PaymentList.insertMany([
            ...newPaymentBreakdown
          ], (err, paymentLists) => {
            res.send({student: saved, paymentLists})
          })
        })
})


router.get('/edit/:studentId', (req, res) => {
  const {studentId} = req.params
  Student.findById(studentId, (err, student) => {
    if (err) return res.status(400).send(err)
    res.send({student})
  })
})


router.get('/:studentId', (req, res) => {
  const {studentId} = req.params
  Student.findById(studentId, (err, student) => {
    if (err) return res.status(400).send(err)
    res.send({student})
  })
})


router.post('/update/:studentId', (req, res) => {
  const {studentId} = req.params
  const {studentInfo, paymentInfo} = req.body
  Student.findByIdAndUpdate(studentId, { ...studentInfo, paymentInfo }, (err, student) => {
                if (err) return res.status(400).send(err)
                res.send(student)
              })
})


router.delete('/:studentId', (req, res) => {
  const {studentId} = req.params
  Student.findByIdAndDelete(studentId, (err, student) => {
    if(err) return res.status(400).send(err)
    PaymentList.deleteMany({ studentId, studentId: new ObjectId(studentId) }, (err) => {})
    PaymentPlanByStudent.deleteMany({ studentId, studentId: new ObjectId(studentId) }, (err, deleted) => {})
    res.send({msg: `Student ${student.firstName} ${student.lastName} is deleted.`})
  })
})


router.post('/deleteNote/:studentId/:noteId', (req, res) => {
  const {studentId, noteId} = req.params
  Student.findById(studentId, (err, result) => {
    if (err) return res.status(400).send({err})
    result.notes.id(noteId).remove()
    result.save(err2 => {
      if (err2) return res.status(400).send({err: err2})
      res.send('test')
    })
  })
})


router.post('/addNotes/:studentId', (req, res) => {
  const {studentId} = req.params
  const {note} = req.body
  Student.findById(studentId, (err, student) => {
    student.notes.push({note})
    student.save().then(result => {
      res.send(result.notes)
    })
  })
})


router.post('/add_new_and_hold_the_current_plan/:studentId/:currentStudentPaymentId', (req, res) => {
  const {studentId, currentStudentPaymentId} = req.params
  const {depositAmount, currency, depositPaidDate, paymentDateStart, paymentPlanId, paymentBreakdown, hasAnd} = req.body
  const newPaymentBreakdown = paymentBreakdown.map(item => {
    return {...item, studentId, paymentPlanId}
  })
  PaymentPlanByStudent.create({
    studentId,
    depositAmount, 
    currency, 
    depositPaidDate, 
    paymentDateStart, 
    paymentPlanId,
    status: 'Active',
  }).then(saved => {
    if (saved) {
      PaymentPlanByStudent.findOneAndUpdate({ 
        paymentPlanId: currentStudentPaymentId,
        studentId
      }, {
        status: 'On-hold',
      }, (err, updated) => {
        PaymentList.insertMany([...newPaymentBreakdown], 
          (err, paymentLists) => {
            if (hasAnd) {
              PaymentList.updateMany(
                {amount: hasAnd.amount, studentId, paymentPlanId }, 
                {amount: hasAnd.amount, type: 'and'},
                (err) => {}
              )
            }
            PaymentPlanByStudent.find((err, allPaymentPlanStudent) => {
              res.send({allPaymentPlanStudent, saved, paymentLists})
            }).sort({ createdAt: -1 })
        })
      })
    }
  })
})

router.post('/update_new_added_plan_by_student/:studentId', (req, res) => {
  const {studentId} = req.params
  const {paymentBreakdown, paymentPlanId} = req.body
  const newPaymentBreakdown = paymentBreakdown.map(item => {
    return {...item, studentId, paymentPlanId}
  })
  PaymentList.insertMany([...newPaymentBreakdown], (err, paymentLists) => {
    res.send(paymentLists)
  })
})

router.post('/add_new_and_cancel_the_current_plan/:studentId/:currentStudentPaymentId', (req, res) => {
  const {studentId, currentStudentPaymentId} = req.params
  const {depositAmount, currency, depositPaidDate, paymentDateStart, paymentPlanId, paymentBreakdown} = req.body
  const newPaymentBreakdown = paymentBreakdown.map(item => {
    return {...item, studentId, paymentPlanId}
  })
  PaymentPlanByStudent.create({
    studentId,
    depositAmount, 
    currency, 
    depositPaidDate, 
    paymentDateStart, 
    paymentPlanId,
    status: 'Active',
  }).then(saved => {
    if (saved) {
      PaymentPlanByStudent.findOneAndUpdate({ 
        paymentPlanId: currentStudentPaymentId,
        studentId
      }, {
        status: 'Cancelled',
      }, (err, updated) => {
        PaymentList.insertMany([...newPaymentBreakdown], 
          (err, paymentLists) => {
            PaymentPlanByStudent.find((err, allPaymentPlanStudent) => {
              res.send({allPaymentPlanStudent, saved})
            }).sort({ createdAt: -1 })
        })
      })
    }
  })
})

router.post('/add_new_plan/:studentId', (req, res) => {
  const {studentId} = req.params
  const {depositAmount, currency, depositPaidDate, paymentDateStart, paymentPlanId, paymentBreakdown} = req.body
  const newPaymentBreakdown = paymentBreakdown.map(item => {
    return {...item, studentId, paymentPlanId}
  })
  PaymentPlanByStudent.create({
    studentId,
    depositAmount, 
    currency, 
    depositPaidDate, 
    paymentDateStart, 
    paymentPlanId,
    status: 'Active',
  }).then(saved => {
    if (saved) {
      PaymentList.insertMany([...newPaymentBreakdown], 
        (err, paymentLists) => {
          PaymentPlanByStudent.find((err, allPaymentPlanStudent) => {
            res.send({allPaymentPlanStudent, saved})
          }).sort({ createdAt: -1 })
      })
    }
  })
})


router.get('/all_payment_plans_by_student_id/:studentId', (req, res) => {
  const {studentId} = req.params
  PaymentPlanByStudent.find({studentId}, (err, paymentPlans) => {
    if (err) return res.sendStatus(500)
    res.send(paymentPlans)
  }).sort({createdAt: -1})
})


router.get('/student-plan-active/:studentId', (req, res) => {
  const {studentId} = req.params
  PaymentPlanByStudent.findOne({studentId, status: 'Active'}, (err, resp) => {
    res.send(resp)
  })
})

router.get('/student-plan/:studentId/:paymentPlanId', (req, res) => {
  const {studentId, paymentPlanId} = req.params
  PaymentPlanByStudent.findOne({studentId, paymentPlanId}, (err, resp) => {
    res.send(resp)
  })
})

router.delete('/student_payment_plan/:id/:paymentPlanId/:studentId', (req, res) => {
  const {id, paymentPlanId, studentId} = req.params
  PaymentPlanByStudent.findByIdAndDelete(id, (err, deleted) => {
    if (deleted) {
      PaymentList.deleteMany({ paymentPlanId, studentId, studentId: new ObjectId(studentId) }, (err, deleteMany) => {})
      Notification.deleteMany({ paymentPlanId }, (err) => {})
    }
  })
})

router.get('/student_payment_plan/:id', (req, res) => {
  PaymentPlanByStudent.findById(req.params.id, (err, found) => {
    res.send(found)
  })
})

router.put('/update_student_payment_plan/:id', (req, res) => {
  const {payload} = req.body
  PaymentPlanByStudent.findByIdAndUpdate(req.params.id, {...payload}, (err, updated) => {
    res.send(updated)
  })
})


module.exports = router