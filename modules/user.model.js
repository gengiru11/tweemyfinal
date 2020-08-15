'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var users_data_Schema = Schema({
    user_name: String,
    user_email: String,
    user_username: String,
    follow:[{}],
    user_password: String,
    tweet:[{ type: Schema.Types.ObjectId, ref:'tweet'}]
});

module.exports = mongoose.model('user', users_data_Schema);


