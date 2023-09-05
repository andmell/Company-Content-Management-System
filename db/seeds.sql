INSERT INTO departments (name)
VALUES  ("Web Development"),
        ("Engineering"),
        ("Human Resources"),
        ("Legal"),
        ("Facilities");

INSERT INTO roles(title, salary, department_id)
VALUES  ("Junior Developer", 65000, 1),
        ("Senior Developer", 95000, 1),
        ("Product Designer", 100000, 2),
        ("Data Analyst", 50000, 2),
        ("Recruiter", 25000, 3),
        ("HR Lead", 75000, 3),
        ("Support Staff", 35000, 5),
        ("Attorny", 150000, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 1),
        ("Jane", "Doe", 8),
        ("Bob", "Mackey", 4),
        ("Julio", "Lopez", 3),
        ("Ahmed", "Al-Hassan", 2),
        ("Parvati", "Singh", 6);
