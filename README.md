# population-management-system
[![Build Status](https://travis-ci.org/zeze111/population-management-system.svg?branch=develop)](https://travis-ci.org/zeze111/population-management-system)

Population Management System that contains a list of locations and the total number of residents in each location broken down by gender.

Setup:
* Install Node js and Postgres on your machine
* run `git clone https://github.com/zeze111/population-management-system.git` in your terminal
* cd into the project root directory
* run `npm install` to install all dependencies
* create a `.env` and provide values for `DB_USER` and `DB_PASSWORD`
* run `createdb population-management` to create the database
* Migrate your database using `sequelize db:migrate` on the command line
* You can undo migrations by running `sequelize db:migrate:undo:all` on the command line
* run `npm start` to start the server
* test on postman using `http://localhost:8000/`

Testing:
* run `createdb populationmanagementtest` to create the test database
* run `npm test`
