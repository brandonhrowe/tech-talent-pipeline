const Sequelize = require("sequelize");

// Determine the name of the database to use depending on whether the Node environment is in test mode ("ttp-stockup-test") or not ("ttp-stockup")
const dbName = `ttp-stockup${process.env.NODE_ENV === "test" ? "-test" : ""}`;

// Define reference to the database depending on whether there is a database URL ready to be referenced or, if not, look for a Postgres db on localhost:5432 with the matching dbName
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`,
  {
    logging: false
  }
);

module.exports = db;
