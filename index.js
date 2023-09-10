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
          "Exit",
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
      } else if (answers.initialChoices === "Exit") {
        process.exit();
      } else if (answers.initialChoices === "Add a role") {
        addRole();
      } else if (answers.initialChoices === "Add an employee") {
        addEmployee();
      } else {
          updateEmployee();
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
}

function displayEmployees() {
  queries
    .getAllEmployees()
    .then(([result]) => {
      console.table(result);
    })
    .then(() => {
      mainMenu();
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the new department?",
        name: "name",
      },
    ])
    .then((answer) => {
      queries
        .addDepartment(answer)
        .then(() => {
          console.log(`${answer.name} department  successfully added!`);
        })
        .then(() => mainMenu());
    });
}

function addRole() {
  queries.getAllDepartments().then(([departments]) => {
    const departmentChoices = departments.map((department) => {
      return {
        value: department.id,
        name: department.name,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the new role?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary of the new role?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department is the new role inside of?",
          name: "department_id",
          choices: departmentChoices,
        },
      ])
      .then((response) => {
        queries
          .addRole(response)
          .then(() => {
            console.log(`${response.title} role successfully added!`);
          })
          .then(() => {
            mainMenu();
          });
      });
    // console.log(departmentChoices);
  });
}
function addEmployee() {
  queries.getAllRoles().then(([roles]) => {
    const roleChoices = roles.map((role) => {
      return {
        value: role.id,
        name: role.title,
      };
    });
    queries.getAllEmployees().then(([employees]) => {
      const managerChoices = employees.map((manager) => {
        return {
          value: manager.id,
          name: `${manager.first_name} ${manager.last_name}`,
        };
      });
      managerChoices.push({ value: null, name: `No Manager` });
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employees first name?",
            name: "first_name",
          },
          {
            type: "input",
            message: "What is the employees last name?",
            name: "last_name",
          },
          {
            type: "list",
            message: "What is the employees position?",
            name: "role_id",
            choices: roleChoices,
          },
          {
            type: "list",
            message: "Who is the employees manager?",
            name: "manager_id",
            choices: managerChoices,
          },
        ])
        .then((response) => {
          queries
            .addEmployee(response)
            .then(() => {
              console.log(
                `${response.first_name} ${response.last_name} successfully added!`
              );
            })
            .then(() => {
              mainMenu();
            });
        });
    });
  });
}

function updateEmployee() {
  queries.getAllEmployees().then(([employees]) => {
    const employeeChoices = employees.map((employee) => {
      return {
        value: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
      };
    });
    queries.getAllRoles().then(([roles]) => {
      const roleChoices = roles.map((role) => {
        return {
          value: role.id,
          name: role.title,
        };
      });
      inquirer
        .prompt([
          {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'employee_id',
            choices: employeeChoices,
          },
          {
            type: 'list',
            message: 'What role would you like to assign this employee?',
            name: 'role_id',
            choices: roleChoices,
          },
        ]).then((response)=>{
          queries.
          updateEmployee(response)
          .then(() => {
            const employeeName = employees.find((employee) => {
             return employee.id === response.employee_id;
            })
            console.log(`${employeeName.first_name} ${employeeName.last_name} successfully updated!`);
          }).then(()=> {
            mainMenu();
          });
        })
    });
  });
}
