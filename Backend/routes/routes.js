var express = require('express');
var controller = require('../controllers/controller');
const phoneController= require('../controllers/phoneController');
const userController = require('../controllers/userController');

var router = express.Router();

router.get('/api', controller.test)
router.get('/api/phone', phoneController.getPhones);
router.post('/api/user/check-credentials', userController.checkUserByCredentials);
module.exports = router;