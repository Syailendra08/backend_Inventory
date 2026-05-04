const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const itemController = require('../controllers/item.controller')

// route.httpMethod('/path', middleware, controller)

// prefix fo=route didefinisikan diapp.js jadi kalau path '/' sama dengan '/items
// single(image) : ambil 1 file yg diuoload di inputan image
router.post('/', upload.single('image'), itemController.createItem);
router.get('/', itemController.getItem);

module.exports = router