SELECT employees.first_name AS first_name, employees.last_name AS last_name, roles.title AS title
FROM employees
JOIN roles ON employees.role_id = roles.id;

SELECT roles.title AS title, roles.salary AS salary, departments.name AS department
FROM roles
JOIN departments ON roles.department_id = departments.id;

