const router = require('express').Router()
const requireAuth = require('../middleware')
const Plan = require('../models/Plan.model')

router.use(requireAuth)

router.get('/', (req, res) => {
  Plan.find((err, plans) => {
    res.send({plans})
  })
})

router.post('/create', (req, res) => {
  const {currency, amount, quantity, recurrence, resultName} = req.body
  const savePlan = new Plan({currency, amount, quantity, recurrence, resultName})
  savePlan.save((err, newPlan) => {
    if (err) return res.sendStatus(500)
    res.send({plan: newPlan})
  })
})

router.get('/:id', (req, res) => {
  Plan.findById(req.params.id, (err, planOne) => {
    if (err) return res.sendStatus(500)
    res.send(planOne)
  })
})

router.put('/update/:id', (req, res) => {
  const {data} = req.body
  const editPlan = Plan.findByIdAndUpdate(req.params.id, {...data}, (err, editedData) => {
    if (err) return res.sendStatus(500)
    res.send(editedData)
  })
})

router.delete('/:id', (req, res) => {
  Plan.findByIdAndDelete(req.params.id, (err, deleted) => {
    if (err) return res.sendStatus(500)
    res.send({deleted: true})
  })
})

module.exports = router