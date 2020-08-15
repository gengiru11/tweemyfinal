'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var mikey = 'my_secret_key'
exports.ensureAuth = (req, res, next)=>{
    var url_text = req.body.mycommands;
    var command_list = url_text.split(" ");
    
    var mycommands = command_list[0]; 

    if(token == null){
        if (mycommands == "REGISTER" || mycommands == "LOGIN") {
            next();
        } else {
            if(!req.headers.authorization){
                return res.status(403).send({message: "UNAUTHORIZED REQUEST, TRY LATER"});
            } else {
                var token = req.headers.authorization.replace(/['"]+/g, '');
                    try{
                        var payload = jwt.decode(token, mikey);
                            if(payload.exp <= moment().unix()){
                                return res.status(401).send({message: "YOUR TOKEN HAS EXPIRED PLEASE MAKE ANOTHER"});
                            }
                    } catch (ex){
                        return res.status(404).send({message: "INVALID TOKEN"});
                    }
            req.user = payload;
            next();
            }
        }
    }
};
