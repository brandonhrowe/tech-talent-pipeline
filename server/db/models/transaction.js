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
    allowNull: false,
    // get() {
    //   let balance = this.getDataValue("originalPrice");
    //   return balance / 100;
    // },
    // set(value) {
    //   if (!isNaN(value) && value > 0) {
    //     this.setDataValue("originalPrice", value * 100);
    //   }
    // }
  }
});

module.exports = Transaction;
