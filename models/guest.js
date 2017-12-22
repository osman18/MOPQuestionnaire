'use strict';

module.exports = function(sequelize, DataTypes) { 
	var Guest = sequelize.define('Guest', {
		uuid: DataTypes.STRING,
		ipAddress: DataTypes.STRING,
		firstname: DataTypes.STRING,
		lastname: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING
	}, {
		classMethods: {
			associate: function(models) {
				Guest.belongsToMany(models.Question, {
					through: {
						model: models.QuestionGuest
					}
				});
			}
		}	
	});

	return Guest;
};