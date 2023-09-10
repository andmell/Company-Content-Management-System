const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "hellogoodbye",
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
  getAllRoles(){
    return this.database
        .promise()
        .query("SELECT * FROM roles");
  }
  getAllEmployees(){
    return this.database
    .promise()
    .query("SELECT * FROM employees");
  }
  addDepartment(departmentName){
    return this.database
      .promise()
      .query('INSERT INTO departments SET ?', departmentName)
  }
  addRole(roleData){
    return this.database
    .promise()
    .query('INSERT INTO roles SET ?', roleData)
  };
  addEmployee(employeeData){
    return this.database
    .promise()
    .query('INSERT INTO employees SET ?', employeeData)
  };
  updateEmployee(updatedRole){
    return this.database
    .promise()
    .query('UPDATE employees SET role_id = ? WHERE id = ?', [updatedRole.role_id, updatedRole.employee_id]);
  };
};

module.exports = new Queries(db);
