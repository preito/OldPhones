var express = require('express')
var controller = require('../controllers/controller')
var router = express.Router()
router.get('/', controller.home)
// router.post('/survey', controller.showResult)
module.exports = router