const Sequelize = require("sequelize");
const db = require("../db");

const Transaction = db.define("transaction", {
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  originalPrice: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  originalChange: {
    type: Sequelize.STRING,
    validate: {
      isIn: [["positive", "negative", "neutral"]]
    }
  }
});

module.exports = Transaction;
