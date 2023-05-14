# E-commerce Back-End Endpoint Application

## Description

Repository Link:
(https://github.com/princessjenn/eCommerce-backEnd.git)

Demo Walkthrough Video Link:
(https://drive.google.com/file/d/1woUtnGcPe3NtoWHof0WC984tjiG0tO7q/view?usp=sharing)

This application will help a business owner user to view, manage, and organize their businesses' departments, roles, and employees in their company via a command-line application

GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)



## Installation

To begin, we need to make sure we have our database seeded into MySQL in our terminal!

`mysql -u root -p`

Then, enter your password.

`source db/schema.sql`

Now that your database has been inputted, let's install our dependencies, Sequelize, and dotenv.

`npm install`

This will install the Sequelize and dotenv modules.

Next, we must seed our database with sample seeds so that we can see them correctly when we apply the enpoint routes inside Insomnia. 

`npm run seed`

Finally, let's invoke our application,

`node server.js`


Now we can open Insomnia while our program is running to test our back-end route API endpoints!

## Usage



## License [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the terms of the MIT license.


## Contributing

To contribute to the project: 

1. start by forking the repository and creating a new branch specifically for your new feature or bug fix.
2. It's important to adhere to the project's coding standards and properly format your code.
3. When committing changes, be sure to write clear and concise messages that describe the changes made.
4. If your contribution affects the user interface or experience, include screenshots or animated GIFs in your pull request to help reviewers understand the changes. 
5. Additionally, make sure your code has been tested and all existing tests pass before submitting a pull request.
6. Finally, please provide a detailed description of your changes and explain why they're necessary !

Thanks so much for contributing! 



## Tests

 
![SQL Test](.png)

## Questions

Ask me on Github: (https://https://github.com/princessjenn)

Email Me for more questions: j.eckenrode@me.com