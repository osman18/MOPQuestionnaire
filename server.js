var express = require('express');
var router = require('./routes');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var uuid = require('uuid');
var session = require('express-session');
var database = require('mysql');
var flash = require('connect-flash');
var app = express();
var user;

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());
app.use(session( {
	genid: function(req) {
		return uuid.v1();
	},
	secret: 'osman18',
	cookie:
	{ 
		secure: false
	},
	resave: false,
	saveUninitialized: false
}));

app.use('/', router);

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/routes" + "/index.jade" );
});

var models = require('./models');

app.set('port', process.env.PORT || 5000);

models.sequelize.query('GRANT ALL ON heroku_ec0bfe9b1ae1583.* TO \'b9aa5643e9bf36\'@\'ip-10-76-156-41.eu-west-1.compute.internal\'', function(err) {
	if(err){
		console.log('An error appeared.');
	} else{
	   console.log('Error granting');
	}   
  });
  
models.sequelize.query('INSERT INTO admin (username,password) VALUES(\'admin\',\'1234\')', function(err) {
	if(err){
		console.log('An error appeared.');
	} else{
	   console.log('Admin added');
	}   
  });

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
});
