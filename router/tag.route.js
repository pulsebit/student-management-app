const router = require('express').Router()
const Tag = require('../models/Tag.model')
const requireAuth = require('../middleware')

router.get('/', requireAuth, (req, res) => {
  Tag.find((err, tags) => {
    if (err) return res.status(400).send(err)
    res.send({tags})
  })
})

router.post('/create', requireAuth, (req, res) => {
  const newTag = new Tag({ name: req.body.name })
  newTag.save()
    .then(tag => {
      res.send({tag})
    })
    .catch(err => res.send(err))
})

module.exports = router