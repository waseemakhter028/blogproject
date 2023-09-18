const { Router } = require('express')

const { index, getSubCat, viewCode, filtercodes } = require('../../../controllers/home.controller')

const router = Router()

router.get('/', index)
router.get('/getsubcat/:id', getSubCat)
router.get('/viewcode/:id', viewCode)
router.post('/filtercodes', filtercodes)

module.exports = router
