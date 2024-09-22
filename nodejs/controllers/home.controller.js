const db = require('../models')
const { Category, SubCategory, Code } = db

const { Op } = require('sequelize')
const { fromBuffer } = require('file-type')
const fs = require('fs')
const path = require('path')

const index = async (req, res) => {
  const { page } = req.query
  const limit = 6
  const currentPage = !page || isNaN(page) ? 0 : parseInt(page)
  const offset = 0 + (currentPage - 1) * limit
  try {
    const category = await Category.findAll({
      attributes: ['id', 'name'],
      // checking category has one sub category
      include: [
        {
          model: SubCategory,
          attributes: ['id', 'name'],
          // checking sub category has one code
          include: [
            {
              model: Code,
              attributes: [],
              required: true,
              where: { status: 1 }
            }
          ],
          // separate:true,
          required: true,
          where: { status: 1 },
          order: [['name', 'ASC']]
        }
      ],
      where: {
        status: 1,
        '$SubCategories.category_id$': { [Op.ne]: null }, // at least one sub category
        '$SubCategories.Codes.sub_category_id$': { [Op.ne]: null } // at least one code
      },
      order: [
        ['name', 'ASC'],
        [{ model: SubCategory }, 'name', 'ASC']
      ] // order by parent and child model
    })

    const codes = await Code.findAll({
      where: {
        status: 1
      },
      offset: offset < 1 ? 0 : offset,
      limit: limit,
      order: [['id', 'DESC']]
    })

    const totalCodes = await Code.count()

    res.status(200).json({
      status: 200,
      categories: category,
      codes: {
        data: codes,
        current_page: currentPage,
        per_page: limit,
        total: totalCodes
      }
    })
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} })
  }
}

const getSubCat = async (req, res) => {
  const { id } = req.params
  let catId = !id ? 1 : id

  try {
    const data = await SubCategory.findAll({
      attributes: ['id', 'name'],
      where: {
        category_id: catId,
        status: 1
      },
      order: [['name', 'ASC']]
    })

    res.status(200).json({
      status: 200,
      data: data
    })
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} })
  }
}
const viewCode = async (req, res) => {
  const { id } = req.params
  let codeId = !id ? 1 : id

  try {
    const data = await Code.findByPk(codeId, {
      where: {
        status: 1
      }
    })

    res.status(200).json({
      status: 200,
      data: data
    })
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} })
  }
}

const filtercodes = async (req, res) => {
  const { action, subcat_ids } = req.body
  let all = null
  const whereCondition = []
  try {
    if (action === 'filtercodes' && Array.isArray(subcat_ids)) {
      whereCondition.push({ sub_category_id: { [Op.in]: subcat_ids } })
      all = 0
    }

    if (
      (typeof action !== 'undefined' && action === 'clearfilter') ||
      (typeof subcat_ids !== 'undefined' && subcat_ids == null)
    ) {
      whereCondition.push({ status: 1 })
      all = 1
    }

    const codes = await Code.findAll({
      where: whereCondition,
      order: [['id', 'ASC']]
    })

    res.status(200).json({
      status: 200,
      data: codes,
      all: all
    })
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} })
  }
}

const saveCodeImage = async (req, res) => {
  const { id } = req.params
  const codeId = !id ? 0 : id
  if (!req.files) {
    res.status(400).json({ status: 'error', message: 'Please Select File.' })
  }
  try {
    const file = req.files.image
    const directory = './public/upload'

    const size = file.size
    const maxSize = 2
    const allowedExtensions = ['jpeg', 'png', 'gif', 'jpg']
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

    const fileInfo = await fromBuffer(file.data)
    const ext = fileInfo.ext.toLowerCase()
    const mimetype = fileInfo.mime.toLowerCase()

    const maxFileSize = maxSize * 1024 * 1024

    if (!allowedMimeTypes.includes(mimetype) || !allowedExtensions.includes(ext)) {
      res.json({ success: false, status: 200, message: 'Please Select jpg, jpeg, png and gif only.' })
    }

    if (size > maxFileSize) {
      res.json({ success: false, status: 200, message:'Max file size is allowed ' + maxSize + ' MB' })
    }

    const codeInfo = await Code.findByPk(codeId, {
      where: {
        status: 1
      }
    })

    if(!codeInfo) {
      res.json({ success: false, status: 200, message: 'code not found' })
    }

    // unlink old files
    const dbFileName = codeInfo.image
    if (dbFileName !== '') {
      const filePath = directory
      if (fs.existsSync(filePath + '/' + dbFileName)) {
        fs.unlink(path.join(filePath, dbFileName), (err) => {
          if (err) throw err
        })
      }
    }

    const imageName = Math.floor(Math.random() * 1000000000) + '_' + file.name

    await Code.update({ image: imageName }, { where: { id: codeId } })

    const save = file.mv(`${directory}/` + imageName)

    if (!save) res.json({ success: false, status: 200, data: 'Something is wrong' })

    res.json({ success: true, status: 200, message: 'File Save Successfully', data: save })
  } catch (e) {
    res.json({ status: 500, data: e.message })
  }
}


module.exports = {
  index,
  getSubCat,
  viewCode,
  filtercodes,
  saveCodeImage
}
