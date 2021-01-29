const router = require('express').Router()
const requiredAuth = require('../middleware')
const Student = require('../models/Student.model')
const PaymentList = require('../models/PaymentList.model')
const ObjectId = require('mongoose').Types.ObjectId; 

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
    PaymentList.deleteMany({ studentId: new ObjectId(studentId) }, (err) => {
      if (err) console.log(err)
    })
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


router.post('/add-payment-breakdown/:studentId', (req, res) => {
  const {studentId} = req.params
  const {payload} = req.body

  Student.findById(studentId, (err, result) => {
    if (err) return res.status(400).send({err})
    result.payment.breakdown.push({...payload})
    result.save().then(student => {
      res.send(student.payment.breakdown)
    })
  })
})


router.get('/payment/:paymentBDId', (req, res) => {
  const {paymentBDId} = req.params
  Student.findOne({'payment.breakdown._id': paymentBDId}, (err, query) => {
    res.send({
      paymentBDOne: query.payment.breakdown.id(paymentBDId),
    })
  })
})

router.put('/payment-update/:paymentBDId', (req, res) => {
  const {paymentBDId} = req.params
  const {amount, currency, dueDate, datePaid, status} = req.body
  Student.findOneAndUpdate({'payment.breakdown._id': paymentBDId}, {$set: {
    'payment.breakdown.$.currency': currency,
    'payment.breakdown.$.amount': amount,
    'payment.breakdown.$.dueDate': dueDate,
    'payment.breakdown.$.datePaid': datePaid,
    'payment.breakdown.$.status': status,
  }}, (err, updated) => {
    if (err) return res.sendStatus(500)
    res.send('updated')
  })
})


router.post('/payment-note-create-or-update', (req, res) => {
  const {userId, studentId, notes, paymentBreakdownData} = req.body
  Student
    .findOneAndUpdate({
      'paymentBreakdown._id': paymentBreakdownData._id 
    }, {
      '$set': {
        'paymentBreakdown.$.amount': paymentBreakdownData.amount,
        'paymentBreakdown.$.currency': paymentBreakdownData.currency,
        'paymentBreakdown.$.dueDate': paymentBreakdownData.dueDate,
        'paymentBreakdown.$.status': paymentBreakdownData.status,
        'paymentBreakdown.$.datePaid': paymentBreakdownData.datePaid,
        'paymentBreakdown.$.notes': notes,
        'paymentBreakdown.$.editedBy': userId,
        'paymentBreakdown.$.updatedAt': new Date(),
      }
    }, (err, result) => {
      if (err) return res.sendStatus(500)
      Student.findById(studentId, (err, result2) => {
        if (err) return res.sendStatus(500)
        res.send(result2.paymentBreakdown)
      })
    })
})


router.get('/paymentId/:pid', (req, res) => {
  const {pid} = req.params
  Student.findOne({ 'paymentBreakdown._id': pid }, (err, result) => {
    if (err) return res.sendStatus(500)
    res.send(result.paymentBreakdown.id(pid))
  })
})


module.exports = router