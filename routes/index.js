var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var models = require('../models');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var validator = require("email-validator");

var userLoggedIn = false;
var userEmail;

//Use this function to check if the user is logged in as an admin
function checkAuth(req, res, next) {
	if (!req.session.loggedIn) {
		res.send('You are not authorized to view this page');
	}else{
		next();
	}
}

//Login authentication 
router.post('/login', function(req, res) {
	var post = req.body;

	//Set the username to admin and password to 1234
	models.sequelize.query('SELECT username FROM admin WHERE username=? AND password=?', {
		replacements: [post.user,post.password],
		type: models.sequelize.QueryTypes.SELECT
	}).then(function(questions) {
		if (questions.length <= 0) {
			res.send('Bad Password');
		}else{
			req.session.loggedIn = true;
			res.redirect('/questions');
		}
	});
});

//Use this function to check if the user is logged
function checkUserAuth(req, res, next) {
	if (!req.session.userLoggedIn) {
		res.send('You are not authorized to view this page');
	}else{
		next();
	}
}

//Login authentication 
router.post('/indexLogin', function(req, res) {
	var post = req.body;

	models.sequelize.query('SELECT email FROM guests WHERE email=? AND password=?', {
		replacements: [post.user,post.password],
		type: models.sequelize.QueryTypes.SELECT
	}).then(function(questions) {
		if (questions.length <= 0) {
			res.send('Bad Password');
		}else{
			userEmail = post.user;
			req.session.userLoggedIn = true;
			userLoggedIn = true;
			res.redirect('/');
		}
	});
});

//Register Guest
router.post('/registerGuest', function(req, res) {
	var post = req.body;

	if(!validator.validate(post.email)==true){
		res.send('Email is not valid.');
	}
	if(post.password!=post.repassword){
		res.send('Password does not match. Plese re-type password correctly.');
	}

	models.sequelize.query('SELECT email FROM guests WHERE email=?', {
		replacements: [post.email],
		type: models.sequelize.QueryTypes.SELECT
	}).then(function(questions) {
		if (questions.length > 0) {
			res.send('Email already exists');
		}else{
			models.Guest.findOrCreate( {
					where: {
						email: post.email
					}
				})

				.spread(function(guest, created) {
					if (created) {
						guest.set( {
							ipAddress: req.ip,
							email: post.email,
							firstname: post.firstname,
							lastname: post.lastname,
							password: post.password
						})

						.save();
					}else{
						res.send('Something went wrong. Please try again later.');
					}
					res.redirect('/');
				});
		}
	});
});


//Register 
router.post('/register', function(req, res) {
	res.render('register');
});

//Get the register page
router.get('/register', function(req, res) {
	res.render('register');
});

//Get the login page
router.get('/login', function(req, res) {
	res.render('login');
});

//Get the logout route
router.get('/logout', function(req, res) {
	req.session.loggedIn = false;
	res.redirect('/');
});

//Get the index login page
router.get('/indexLogin', function(req, res) {
	res.render('indexLogin');
});

//Get the index logout route
router.get('/indexLogout', function(req, res) {
	userLoggedIn = false;
	userEmail = null;
	req.session.userLoggedIn = false;
	res.redirect('/');
});

//Get the questions for the homepage
router.get('/', function(req, res) {
	if(userLoggedIn == false){
		res.render('indexLogin');
	}else{
		models.Guest.findOne( {
			where: {
				email: userEmail
			}
		})
			.then(function(guest) {
				if(guest==null){
					res.render('empty');
				}
				//Select a question from the database randomly
				models.sequelize.query('SELECT id FROM Questions WHERE id NOT IN(SELECT QuestionId AS id FROM QuestionGuests WHERE GuestId = ?) ORDER BY RAND() LIMIT 1', {
					replacements: [guest.id],
					type: models.sequelize.QueryTypes.SELECT
				})

					.then(function(questions) {
						if (questions.length <= 0) {
							//Answered all the questions, redirect to a page with no more questions
							res.render('empty');
						}else{
							models.Question.findById(questions.pop().id)
							.then(function(question) {
								question.getChoices().then(function(associatedChoices) {
									res.render('index', {
										question: question,
										choices: associatedChoices,
										guest: guest,
										title: question.question
									});
								});
							});
						}
					});
				});
	}
	
});

//Save response and question Id to the guest model
router.post('/', function(req, res) {
	models.QuestionGuest.create( {
		QuestionId: req.body.question_id,
		GuestId: req.body.guest_id,
		ChoiceId: req.body.choice_id
	})

	.then(function(result) {
		res.redirect('/');
	});
});

//Get the results for the question with specific ID
router.get('/questions/:id/results', checkAuth, function(req, res, next) {
	models.Question.findById(req.params.id)
	.then(function(question) {
		if ( ! question){
  			res.status(500).send('Cannot find question');
		}

		models.sequelize.query('select c.choice, count(guest.id) as totalVotes from Choices c left join QuestionGuests guest on c.id = guest.ChoiceId where c.QuestionId = ? group by c.id order by totalVotes desc', {
			replacements: [question.id],
			type: models.sequelize.QueryTypes.SELECT
		})

		.then(function(choices) {
			res.render('results', {
				question:question,
				choices: choices
			});
		});
	})

	.catch(function(error) {
		console.error(err);
  		res.status(500).send('There was an error');
	});
});

//Save question text into mysql database
router.post('/add-question', checkAuth, function(req, res, next) {
	models.Question.create( {
		question: req.body.question
	})

	.then(function(question) {
		res.redirect('/questions/'+question.id);
	})
	.catch(function(error) {
		console.error(error);
		res.status(500).send('There was an error');
	});
});

//Get the specific question page
router.get('/questions/:id', checkAuth, function(req, res, next) {
	models.Question.findById(req.params.id, {
		include: [{
			model: models.Choice
		}]
	})

	.then(function(question) {
		if ( ! question) {
  			res.status(500).send('Cannot find question');
		}
		
		res.render('question', {
			question: question
		});
	});
});

//Get all questions for the Manage Questions page
router.get('/questions', checkAuth, function(req, res, next) {
	models.Question.findAndCountAll( {
		order: 'id desc'
	})

	.then(function(result) {
		var total = result.count;
		res.render('questions', {
			questions: result.rows
		});
	});
});

//Save response text into mysql database
router.post('/questions/:id/choices/add', checkAuth, function(req, res, next) {
	models.Choice.create( {
		choice: req.body.choice,
		QuestionId: req.params.id
	})

	.then(function() {
		res.redirect('/questions/' + req.params.id);
	});
});

//Update question text in edit question
router.post('/questions/:id', function(req, res, next) {
	models.Question.findById(req.params.id)
		.then(function(question) {
			question.set({
				question: req.body.question
			})
			.save()
			.then(function(question) {
				//req.flash('success', 'updated');
				res.redirect('/questions/' + question.id);
			});
		});
});

//Delete a question on the questions page
router.get('/questions/:id/delete', function(req, res, next) {
	models.Question.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(function(question) {
		res.redirect('/questions');
	});
});

//Update response text in edit question
router.post('/questions/:id/choices/:choiceId', checkAuth, function(req, res, next) {
	models.Choice.findById(req.params.choiceId)
		.then(function(choice) {
			choice.set({
				choice: req.body.choice
			})
			.save()
			.then(function(choice) {
				//req.flash('success', 'updated');
				res.redirect('/questions/' + req.params.id);
			});
		});
});

//Delete a response in edit question
router.get('/questions/:id/choices/:choiceId/delete', checkAuth, function(req, res, next) {
	models.Choice.destroy({
		where: {
			id: req.params.choiceId
		}
	})
	.then(function() {
		res.redirect('/questions/' + req.params.id);
	});
});



module.exports = router;