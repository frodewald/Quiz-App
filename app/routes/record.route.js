module.exports = (app) => {
  const records = require('../controllers/record.controller')
  const router = require('express').Router()

  router.post('/record/post', records.postRecords)
  router.get('/record/getAllRecords', records.getRecordsByHighestScore);

  app.use('/api', router)
}