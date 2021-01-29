const router = require('express').Router()
const requireAuth = require('../middleware')
const Tab = require('../models/Tab.model')
const mongoose = require('mongoose')

router.get('/', requireAuth, async (req, res) => {
  const data = await Tab.find()
  res.send(data)
})

router.get('/:tabID', requireAuth, async (req, res) => {
  const {tabID} = req.params
  Tab.findById(tabID, (err, doc) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.send(doc)
    }
  })
})

router.post('/create', requireAuth, async (req, res) => {
  const {name, fieldData} = req.body
  const newTab = new Tab({name, tabField: fieldData})
  const save = newTab.save()
  res.send(save)
})

router.post('/create-new', (req, res) => {
  const tab = new Tab({name: 'test', test: 'real test'})
  tab.save()
  res.send('test')
})

module.exports = router