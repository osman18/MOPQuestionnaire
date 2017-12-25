MOP Questionnaire
==========
To set up the database, in the config/config.json file replace 

  {
    "development": {
    "username": "root",
    "password": null,
    "database": "surveys_database",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }

with the credentials of your MySQL account and the name of your local database. 
Next we install all dependencies with a call to 
	`npm install`.

Next we have to use Sequelize to perform a database migration. In your command line, execute
`sequelize db:migrate`

This should properly configure your local database. 

After that into table ADMIN insert username and password for Admin user. Connect to database and execute
`INSERT INTO admin (username,password) VALUES(\'admin\',\'1234\')`

Next we can start up the server by calling 
	`npm start`, and the application should now be running at 
[http://localhost:5000/](http://localhost:5000/)

When the app is started we can run some test cases. Navigate to test folder (command: cd test) and run tests by calling `mocha`
