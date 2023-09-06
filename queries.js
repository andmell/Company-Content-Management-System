const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "NokiaLumina1020",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

class Queries {
  constructor(database) {
    this.database = database;
  }
  getAllDepartments() {
    return this.database
      .promise()
      .query("SELECT * FROM departments;");
  }
}

module.exports = new Queries(db);
