'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var mikey = 'my_secret_key'
exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_username: user.user_username,
        user_password: user.String,
        iat: moment().unix(),
        exp: moment().add(2, "days").unix()
    }
    return jwt.encode(payload, mikey);
}