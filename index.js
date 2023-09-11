const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const queries = require("./queries");

// Upon initialization, we call the main menu function that starts the program.
mainMenu();

//The main menu function that will prompt the user for an action to take, and will engage a function depending on their choice.
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
// Will call upon the getAllDepartments() function in the queries page, then show the result in a table.
function displayDepartments() {
  queries
    .getAllDepartments()
    .then(([result]) => {
      console.table(result);
    })
    .then(() => {
      mainMenu();
    });
};
// Will call all departments, and then all roles, and will display both the roles and the related departments in a table with each other.
function displayRoles() {
  queries.getAllDepartments().then(([departments]) => {
    queries
      .getAllRoles()
      .then(([roles]) => {
        const roleTableData = roles.map((role) => {
          const deptName = departments.find((deptName) => {
            return deptName.id === role.department_id;
          });
          return {
            title: role.title,
            salary: role.salary,
            department: deptName.name,
          };
        });
        console.table(roleTableData);
      })
      .then(() => {
        mainMenu();
      });
  });
}
// Similar to the displayDepartments function. This will call all employee data from the employee table and display it in a table.
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
// Will insert a department into the department table. Will first ask the name, and then will shove the answer into the addDepartment function, which will insert it into the database.
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
// Similar to the addDepartment function, but will ask the name, salary and department of the new role.
// This function creates a constant called "department choices" which will create an array of all data currently in the department database, and put it in an array to use in a prompt.
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
  });
};
// Similar to the addRole function, this function will create an array of managers and roles to choose from, when deciding the employee's role and manager. Will pull data from existing database.
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
//This function will first create an array of employees to choose from. The function will also create an array of roles to use later.
// Inquirer will prompt the user with the employee array, and then the role array.
// The function will then call the updateEmployee function in the queries file to push the data from the first two questions into the database.
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
            type: "list",
            message: "Which employee would you like to update?",
            name: "employee_id",
            choices: employeeChoices,
          },
          {
            type: "list",
            message: "What role would you like to assign this employee?",
            name: "role_id",
            choices: roleChoices,
          },
        ])
        .then((response) => {
          queries
            .updateEmployee(response)
            .then(() => {
              const employeeName = employees.find((employee) => {
                return employee.id === response.employee_id;
              });
              console.log(
                `${employeeName.first_name} ${employeeName.last_name} successfully updated!`
              );
            })
            .then(() => {
              mainMenu();
            });
        });
    });
  });
}
