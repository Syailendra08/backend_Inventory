const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const loanController = require('../controllers/loan.controller')

// karena post dan put/patch sudah terikat dengan middleware upload. jd tidak ada gambar upload di post di tambahlan tapi kosong : none()
router.post('/', upload.none(), loanController.createLoan)

module.exports = router