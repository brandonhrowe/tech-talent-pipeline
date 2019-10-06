const Sequelize = require("sequelize");

// Define reference to the database depending on whether there is a database URL ready to be referenced or, if not, look for a Postgres db on localhost:5432 with the matching dbName
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/ttp-stockup`,
  {
    logging: false
  }
);

module.exports = db;
