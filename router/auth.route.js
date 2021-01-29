const router = require('express').Router()
const User = require('../models/User')
const {passwordCompare, passwordHash} = require('../helpers/passwordHash')
const jwt = require('jsonwebtoken')
const requiredAuth = require('../middleware')

router.post('/login', async (req, res) => {
  const {email, password} = req.body
  const user = await User.findOne({email})
  if (user) {
    const isMatch = await passwordCompare(password, user.password)
    if (!isMatch) {
      res.send({error: 'Password is incorrect!'})
    } else {
      const jwtPayload = {id: user._id, email: user.email}
      const accessToken = jwt.sign({...jwtPayload}, process.env.SECRET_TOKEN)
      res.cookie('access_token', accessToken, {httpOnly: true, signed: true})
      res.send({isLoggedIn: true, user: jwtPayload})
    }
  } else {
    res.send({error: 'Password is incorrect!'})
  }
})

router.get('/', requiredAuth, async (req, res) => {
  const users = await User.find({})
  res.send(users)
})

router.get('/cookie', requiredAuth, (req, res) => {
  res.send(req.signedCookies)
})

router.get('/profile', requiredAuth, (req, res) => {
  res.send('See profile')
})

router.get('/onAuthStateChanged', (req, res) => {
  const {access_token} = req.signedCookies
  if (!access_token) {
    res.send({
      loggedIn: false,
        user: null
    })
  } else {
    jwt.verify(access_token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) {
        res.send({
          loggedIn: false,
          user: null
        })
      }
      else {
        res.send({
          loggedIn: true,
          user: decoded
        })
      }
    })
  }
})

router.get('/logout', requiredAuth, (req, res) => {
  res.cookie('access_token', '', {maxAge: 0})
  res.send({loggedIn: false})
})

module.exports = router