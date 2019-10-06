const Sequelize = require("sequelize");
const crypto = require("crypto");
const db = require("../db");

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    // This is to keep the password private, by returning it as a function that will not be included in the JSON data sent back upon request
    get() {
      return () => this.getDataValue("password");
    }
  },
  salt: {
    type: Sequelize.STRING,
    // This is to keep the salt private, by returning it as a function that will not be included in the JSON data sent back upon request
    get() {
      return () => this.getDataValue("salt");
    }
  },
  balance: {
    type: Sequelize.INTEGER,
    defaultValue: 500000,
    validate: {
      min: 0
    },
    // The get and set properties allow for the monetary values to be stored in the database as full integers of cents, and then when sent to or retrieved from the frontend, the value will be converted to/from full dollars.
    get() {
      let balance = this.getDataValue("balance");
      return balance / 100;
    },
    set(value) {
      if (!isNaN(value) && value > 0) {
        this.setDataValue("balance", value * 100);
      }
    }
  }
});

module.exports = User

// Check if the password passed in is valid
User.prototype.correctPassword = function (inputPassword) {
  return User.encryptPassword(inputPassword, this.salt()) === this.password()
}

// Utilizes crypto library to create a random salt value
User.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64')
}

// Hashes password so that the plain password is not saved as is to the database
User.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

// Calls above methods to perform salt generation and password encryption
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

// Hooks to assure that above method is called whenever a user is created or updated
User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.beforeBulkCreate(users => {
  users.forEach(setSaltAndPassword)
})
