const jwt = require('jsonwebtoken')

const requiredAuth = (req, res, next) => {
  const token = req.signedCookies.access_token
  if (!token) {
    res.sendStatus(401)
  } else {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) res.sendStatus(401)
      else next()
    })
  }
}

module.exports = requiredAuth