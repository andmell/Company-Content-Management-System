const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const queries = require("./queries");

// db.query(`SELECT employees.first_name AS first_name, employees.last_name AS last_name, roles.title AS title
// FROM employees
// JOIN roles ON employees.role_id = roles.id;`, null, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });
mainMenu();

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "initialChoices",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
        ],
      },
    ])
    .then((answers) => {
      if (answers.initialChoices === "View all departments") {
        console.log("Initial Choice Declared");
        displayDepartments();
      } else if (answers.initialChoices === "View all roles") {
        displayRoles();
          } else if (answers.initialChoices === "View all employees") {
            displayEmployees();
          } else if (answers.initialChoices === "Add a department") {
            addDepartment();
        //   } else if (answers.initialChoices === "Add a role") {
        //     store.addRole();
        //   } else if (answers.initialChoices === "Add an employee") {
        //     store.addEmployee();
        //   } else {
        //     store.updateEmployee();
      }
    });
}

function displayDepartments() {
  queries
    .getAllDepartments()
    .then(([result]) => {
      console.table(result);
    })
    .then(() => {
      mainMenu();
    });
}
function displayRoles() {
  queries
    .getAllRoles()
    .then(([result]) => {
      console.table(result);
    })
    .then(() => {
      mainMenu();
    });
};

function displayEmployees(){
    queries
    .getAllEmployees()
    .then(([result])=> {
        console.table(result);
    })
    .then(() => {
        mainMenu();
    });
};

function addDepartment(){
    inquirer
        .prompt([
            {
                type: 'input',
                message: "What is the name of the new department?",
                name: 'name'
            }
        ]).then((answer)=>{
            queries
            .addDepartment(answer).then(()=>{
                console.log(`${answer.name} department  successfully added!`)
            }).then(()=> mainMenu())
        });
}

// {
//     type: 'input',
//     message: `What's the name of the department you would like to add?`,
//     name: 'DepartmentName',
//     when: (answers) => answers.initialChoices === 'Add a department',
// },
// {
//     type: 'input',
//     message: `What's the title of the role you would like to add?`,
//     name: 'roleTitle',
//     when: (answers) => answers.initialChoices === 'Add a role',
// },
