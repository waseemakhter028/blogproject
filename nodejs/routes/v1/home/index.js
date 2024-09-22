const { Router } = require('express')

const { index, getSubCat, viewCode, filtercodes, saveCodeImage } = require('../../../controllers/home.controller')

const router = Router()

router.get('/', index)
router.get('/getsubcat/:id', getSubCat)
router.get('/viewcode/:id', viewCode)
router.post('/filtercodes', filtercodes)
router.post('/savecodeimage/:id', saveCodeImage)

module.exports = router
