const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const loanController = require('../controllers/loan.controller')
const returnController = require('../controllers/return.controller')

// karena post dan put/patch sudah terikat dengan middleware upload. jd tidak ada gambar upload di post di tambahlan tapi kosong : none()
router.post('/', upload.none(), loanController.createLoan)
router.get('/', loanController.getLoans)
/* router.get('/:id/return', returnController.createReturn) */
router.post('/:id/return', upload.none(), returnController.createReturn);
module.exports = router