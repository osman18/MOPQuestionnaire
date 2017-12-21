MOP Questionnaire
==========
To set up the database, in the config/config.json file replace 

	"development": {
	    "username": "root",
	    "password": null,
	    "database": "database_test",
	    "host": "127.0.0.1",
	    "dialect": "mysql"
	}

with the credentials of your MySQL account and the name of your local database. 
Next we install all dependencies with a call to 
	`npm install`.


Next we have to use Sequelize to perform a database migration. In your command line, execute
`sequelize db:migrate`


This should properly configure your local database. Next we can start up the server by calling 
	`npm start`, and the application should now be running at 
[http://localhost:5000/](http://localhost:5000/)