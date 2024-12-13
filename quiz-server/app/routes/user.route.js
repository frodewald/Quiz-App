module.exports = (app) => {
  const users = require('../controllers/user.controller')
  const router = require('express').Router()

  router.post('/login', users.login)
  router.post('/register', users.register)
  router.get('/user/profile', users.getUser)
  router.post('/user/update/profile', users.updateUser)
  router.post('/logout', users.logout)

  app.use('/api', router)
}