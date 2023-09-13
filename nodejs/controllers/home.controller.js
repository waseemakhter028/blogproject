const db = require("../models");
const { Category, SubCategory, Code } = db;
const sequelize = db.Sequelize;
const { QueryTypes, Op } = require("sequelize");

const index = async (req, res) => {
  const { page } = req.query
  const limit = 6
  const currentPage = !page || isNaN(page) ? 0 : parseInt(page);
  const offset =  0 + (currentPage - 1) * limit;
  try {
    const category = await Category.findAll({
      attributes: ["id", "name"],
      where: {
        status: 1,
      },
      order: [["name", "ASC"]],
    });

    const codes = await Code.findAll({
      where: {
        status: 1,
      },
      offset: offset < 1 ? 0 : offset,
      limit: limit,
      order: [["id", "DESC"]],
    });

    totalCodes = await Code.count()

    res.status(200).json({
      status: 200,
      categories: category,
      codes: {
        data: codes,
        current_page: currentPage,
        per_page: limit,
        total: totalCodes
      },
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};

const getSubCat = async (req, res) => {
  const { id } = req.params;
  let catId = !id ? 1 : id;

  try {
    const data = await SubCategory.findAll({
      attributes: ["id", "name"],
      where: {
        category_id: catId,
        status: 1,
      },
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};
const viewCode = async (req, res) => {
  const { id } = req.params;
  let codeId = !id ? 1 : id;

  try {
    const data = await Code.findByPk(codeId,{
      where: {
        status: 1
      }
    });

    res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};


const filtercodes = async (req, res) => {
  const { action, subcat_ids } = req.body
  let codes = null;
  let all   = null;
  const whereCondition = [];
  const orderBy = [];

  try {
    if(action === 'filtercodes' && Array.isArray(subcat_ids)){
      
      whereCondition.push({sub_category_id: {[Op.in]: subcat_ids}});
      all = 0;
    }

    if( typeof action !== 'undefined' && typeof action === 'clearfilter'  || (typeof subcat_ids !== 'undefined' && subcat_ids==null)){
      whereCondition.push({status: 1});
      all = 1;
    }

    const codes = await Code.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      status: 200,
      data: codes,
      all: all
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};


module.exports = {
  index,
  getSubCat,
  viewCode,
  filtercodes
};
