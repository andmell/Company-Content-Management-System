const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'NokiaLumina1020',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

db.query(`SELECT employees.first_name AS first_name, employees.last_name AS last_name, roles.title AS title
FROM employees
JOIN roles ON employees.role_id = roles.id;`, null, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'initialChoices',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role']
        }
    ]);