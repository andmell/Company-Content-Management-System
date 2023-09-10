const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const queries = require("./queries");

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "hellogoodbye",
      database: "company_db",
    },
    console.log(`Connected to the company_db database.`)
  );


  db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the Database!');
  })

const query = 'SELECT * FROM DEPARTMENTS';

db.query(query, (err,rows) => {
    if (err) throw err;
    const dataArray = rows.map((row) => Object.values(row));
    console.log(dataArray);
    inquirer.prompt([
        {
            type: 'list',
            message: 'Where would you like to assign them?',
            name: 'departmentlist',
            choices: dataArray,
        },
    ])
})



// connection.departmentData(query, (err, rows) => {
//     if (err) throw err;
// }).then((data) => {
//     const dataArray = rows.map((row) => data.values(row));
// console.log(dataArray);
// });

