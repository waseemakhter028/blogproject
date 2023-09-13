const db = require("../models");
const User = db.User;
const Order = db.Order;
const sequelize = db.Sequelize;
const { QueryTypes } = require("sequelize");

const index = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
        include: [sequelize.fn("CONCAT", sequelize.col("name"), "Akht")],
      },
      order: [["id", "DESC"]],
      // group: ["name"],
      limit: 100000,
      offset: 0,
    });
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};

const create = async (req, res) => {
  const { name, email, city, age } = req.body;
  if (!name || !email || !city || !age)
    res.status(200).json({
      success: true,
      message: "Please provide all data",
    });

  try {
    const data = await User.create({
      name: name,
      email: email,
      city: city,
      age: age,
    });
    res.status(200).json({
      success: true,
      message: "Users add successfully",
      data: data,
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};

const show = async (req, res) => {
  const { id } = req.params;
  if (!id)
    res.status(200).json({
      success: true,
      message: "Please provide all data",
    });
  try {
    const users = await User.findByPk(id, {
      attributes: ["id", "name", "email", "city", "age"],
      include: [Order],
    });
    res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: users,
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};

const update = async (req, res) => {
  const { name, email, city, age } = req.body;
  const { id } = req.params;

  if (!name || !email || !city || !age || !id)
    res.status(200).json({
      success: true,
      message: "Please provide all data",
    });
  try {
    const users = await User.update(
      {
        name: name,
        email: email,
        city: city,
        age: age,
      },
      {
        where: {
          id: id,
        },
        returning: true,
        plain: true
      }
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: users,
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;
  if (!id)
    res.status(200).json({
      success: true,
      message: "Please provide all data",
    });

  try {
    const users = await User.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: users,
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};

const conditionalQuery = async (req, res) => {
  const { id, name, email, city, order_id } = req.body;
  try {
    const whereCondition = [];

    const orderBy = [];

    orderBy.push(["id", "DESC"], ["name", "ASC"]);

    if (id) whereCondition.push({ id: id });

    if (email) whereCondition.push({ email: email });

    if (city) whereCondition.push({ city: city });

    if (name) whereCondition.push({ name: name });

    if (order_id)
      whereCondition.push(
        sequelize.where(sequelize.col("Orders.id"), "=", order_id)
      );

    const users = await User.findAll({
      include: Order,
      where: whereCondition,
      order: orderBy,
    });
    res.status(200).json({
      success: true,
      message: "Conditional query users fetched successfully",
      data: users,
    });
  } catch (e) {
    return res.json({ success: false, message: e.message, data: {} });
  }
};

module.exports = {
  index,
  create,
  show,
  update,
  destroy,
  conditionalQuery,
};
