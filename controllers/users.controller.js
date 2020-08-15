'use strict'
var Users = require('../modules/user.model');
var Tweets = require('../modules/tweet.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
const { findById } = require('../modules/user.model');

function mycommandos(req, res) {
    var url_text = req.body.mycommands;
    var command_list = url_text.split(" ");
    var params = req.body;
    var mycommands = command_list[0];
    switch(mycommands){
        //
case "LIKE_TWEET": 
var user_Id = req.user.sub;
var tweets_Id = command_list[1];

Tweets.findById(tweets_Id, (err, tweetsAllready)=>{
    
    var noLike = tweetsAllready.noLike;
    var noDisLike = tweetsAllready.noDisLike;
    
    if(err){
        res.status(500).send({ message:"INTERNAL SERVER EROR" });
    } else if (tweetsAllready){
        Users.findOne( {tweet:{_id: tweets_Id} }, (err, verificacionDeDatos) => {
            if(err){
                return res.status(500).send({ message:"INTERNAL SERVER EROR" });
            } else if (verificacionDeDatos) {
                Users.findOne({_id:user_Id, 'follow.user_username':verificacionDeDatos.user_username}, (err, followData) => {
                    if(err){
                        return res.status(500).send({ message:"INTERNAL SERVER EROR" });
                    } else if (followData){
                        Tweets.findById(tweets_Id, (err, searchTweet) => {
                            if(err){
                                return res.status(500).send({ message:"INTERNAL SERVER EROR" });
                            } else if (searchTweet){
                                Tweets.findOne({tweets_Id, tweet_likes:{ $elemMatch:{tweets_Id} }}, ( err, findTweet ) => {
                                    if(err){
                                        return res.status(500).send({ message:"INTERNAL SERVER EROR" });
                                    } else if (findTweet){
                                        return res.status(200).send({ message:"THIS TWEET ALREADY OWN YOUR LIKE" });
                                    } else {
                                        Users.findById(user_Id, {user_username:1, _id:0}, (err, likeAuser) => {
                                            if(err){
                                                return res.status(404).send({ message:"INTERNAL SERVER EROR" });
                                            } else if (likeAuser){
                                               Tweets.findOne( {tweet_likes:likeAuser}, (err, verification) => {
                                                    if(err){

                                                        return res.status(500).send({ message:"INTERNAL SERVER EROR" });
                                                    
                                                    } else if (verification){
                                                        return res.status(200).send({ message:"THIS PUBLICATION ALREADY HAS YOUR LIKE" });
                                                    
                                                    } else {
                                                        Tweets.findOne( {dislike:likeAuser}, (err, nolikes) => {
                                                            if(err){
                                                                
                                                                return res.status(500).send({ message:"INTERNAL SERVER ERROR" })
                                                            } else if (nolikes){
                                                                
                                                                Tweets.findByIdAndUpdate(tweets_Id, { $pull:{dislike: likeAuser}, noDisLike: Number(noDisLike - 1) }, {new:true}, (err, updateState) => {
                                                                    if(err){
                                                                        return res.status(500).send({ message:"INTERNAL SERVER ERROR", err })                
                                                                    }else if(updateState){   
                                                                        Tweets.findByIdAndUpdate(tweets_Id, { $push:{tweet_likes: likeAuser}, noLike: Number(noLike + 1)}, {new:true}, (err, updateState2) => { 
                                                                            if(err){
                                                                                return res.status(500).send({ message:"INTERNAL SERVER ERROR", err });
                                                                            
                                                                            } else if (updateState2){                                                                                
                                                                                return res.status(200).send({ message:updateState2 });
                                                                                
                                                                            } else {
                                                                                res.status(404).send({ message: "IT HAS NOT BEEN POSSIBLE TO CHANGE THE STATUS OF THE TWEET" });
                                                                            };
                                                                        });
                                                                    } else {
                                                                        
                                                                        return res.status(404).send({ message:" AN ERROR OCCURRED WHEN GIVING DISLIKE" });
                                                                    
                                                                    }
                                                                });                                                               
                                                            } else {
                                                                Tweets.findByIdAndUpdate(tweets_Id, { $push:{tweet_likes: likeAuser}, noLike: Number(noLike + 1) }, {new:true}, (err, updateState2) => { 
                                                                    if(err){
                                                                        
                                                                        return res.status(500).send({ message:"INTERNAL SERVER ERROR", err });
                                                                    
                                                                    } else if (updateState2){                                                                                
                                                                        return res.status(200).send({ message:updateState2 });
                                                                        
                                                                    }else{
                                                                        return res.status(404).send({ message: "ERROR WHEN CHANGING THE TWEET STATUS" });
                                                                    };
                                                                });
                                                            }
                                                        });                                                                                                                          
                                                    }
                                                });
                                            }else{
                                                return res.status(404).send({ message: "USER NOT FOUND IN OUR DB" });
                                            };
                                        });
                                    };
                                });           
                            }else{
                                return res.status(404).send({ message:"TWEET NOT FOUND" });
                            };
                        });
                    }else{
                        res.status(404).send({ message:"DO NOT FOLLOW THIS PERSON"});
                    };
                });
            }else{
                res.status(404).send({ message:"THESE TWEET DATA DOES NOT EXIST" });
            };
        });
    }else{
        res.status(404).send({ message:" IMPOSSIBLE TO SHOW THE REQUIRED DATA, TRY AGAIN" })
    };
});

break;
//
case "DISLIKE_TWEET":
var user_Id = req.user.sub;
var tweets_Id = command_list[1];

Tweets.findById(tweets_Id, (err, searchTweet) => {
    
    var noDisLike = searchTweet.noDisLike;
    var noLike = searchTweet.noLike;

    if(err){
        
        return res.status(500).send({ message:"INTERNAL SERVER ERROR", err });
    
    }else if(searchTweet){
        
        Tweets.findOne( { tweets_Id, tweet_dislike:{ $elemMatch:{ tweets_Id } } }, ( err, findTweet )=>{
            if(err){

                return res.status(500).send({ message:"INTERNAL SERVER EROR", err });
            
            }else if(findTweet){

                return res.status(200).send( { message:"THIS TWEET IS ALLREADY DISLIKE" } );
            
            }else{
                
                Users.findById(user_Id, { user_username:1, _id:0 }, ( err, likeAuser ) => {
                    if(err){
                        return res.status(404).send({ message:"INTERNAL SERVER EROR", err });
                    
                    } else if (likeAuser) {
                        Tweets.findOne( { tweet_likes:likeAuser}, (err, verification ) => {
                            
                            if(err){
                                
                                return res.status(500).send({ message:"INTERNAL SERVER EROR", err });
                            
                            } else if (verification){
                                Tweets.findOne( { tweet_dislike:likeAuser}, (err, verification2)=>{
                                    if(err){
                                        
                                        return res.send(500).send({ message:"INTERNAL SERVER EROR", err });
                                    
                                    } else if (verification2){
                                        
                                        res.status(200).send({ message:"YOU HAVE ALREADY GIVEN DISLIKE" });
                                    
                                    } else {                                       
                                        
                                        Tweets.findByIdAndUpdate(tweets_Id, { $pull:{tweet_likes:likeAuser}, noLike:Number(noLike - 1) }, {new:true}, (err, updateState ) => {
                                            if(err){
                                                return res.status(500).send({ message:"INTERNAL SERVER ERROR", err });
                                            
                                            } else if (updateState){

                                                Tweets.findByIdAndUpdate(tweets_Id, { $push: {tweet_dislike:likeAuser}, noDisLike:Number(noDisLike + 1 ) }, {new:true}, (err, updateState2) => { 
                                                    if(err){
                                                        return res.status(500).send({ message:"INTERNAL SERVER ERROR", err });
                                                    
                                                    } else if (updateState2) {
                                                        return res.status(200).send({ message:updateState2 });

                                                    }else{
                                                        
                                                        return res.status(404).send({ message: "ERROR WHEN CHANGING THE TWEET STATUS" });
                                                    
                                                    };
                                                });
                                            } else {
                                                
                                                return res.status(404).send( { message:"ERROR REMOVING THE LIKE FROM THIS TWEET" });

                                            }
                                        });
                                    }
                                });
                        }else{

                                return res.status(200).send({ message:"YOU CANNOT DISLIKE IF YOU HAVE NOT LIKED YET"});   
                            
                            }
                        });
                    } else {

                        return res.status(404).send({ message: "USER NOT LOCATED IN THE DB" });

                    };
                });
            }
        });           
    } else {
        
        return res.status(404).send({ message:"TWEET NOT FOUND" });
    }
});
break;
//
case "REPLY_TWEET":
command_list.shift();
var content_id = command_list[0];
command_list.shift();
var commentary = command_list.join(" ");

var user_username = req.user.user_username;

Tweets.findById(content_id, ( err, verification ) => {
    
    var noReply = verification.noReply;

    if(err){
        
        return res.status(500).send({ message:"INTERNAL SERVER ERROR" });
    
    } else if (verification){
        
        if( command_list[1] != null && command_list[1] != '' ){
            Tweets.findByIdAndUpdate( content_id, { $push:{responce:{ user_username, commentary }}, noReply:Number(noReply + 1)}, {new:true}, (err, commit1) => {
                if(err){
                    
                    return res.status(500).send({ message:"INTERNAL SERVER EROR", err });
                } else if (commit1){          
                    
                    return res.status(500).send( { commit1 } );                        
                
                } else {
                    return res.status(404).send({message:"PACKAGE SENDING ERROR"})
                
                }
            });
        } else {            
           
            return res.status(500).send({ message:" YOU HAVE NOT WRITTEN YET, PLEASE SEND SOMETHING" });

        }
    } else {
        return res.status(404).send({ message:"TWEET EXISTING IN THE DB" });
    }
});

break;
//
case "RETWEET":
command_list.shift();
var tweets_Id = command_list[0];
command_list.shift();
var comment = command_list.join(" ");

user_Id = req.user.sub;
userna = req.user.user_username;

Tweets.findById(tweets_Id, (err, primarydataTweet)=>{ 
    
    var noTweet = primarydataTweet.noRetweet;
    
    if(err){
        
        return res.status(500).send({ message:"INTERNAL SERVER ERROR" });

    } else if (primarydataTweet){
        Users.findOne({ user_username:userna, tweet:primarydataTweet._id },  (err, acceptdata) => {
            if(err){

                return res.status(500).send({ message:"INTERNAL SERVER EROR" });
            
            } else if (acceptdata){

                Tweets.findByIdAndUpdate(tweets_Id, { $pull:{commentsRetweet:comment}, noRetweet:Number(noTweet - 1) }, {new:true}, ( err, deleteComment ) => {
                    if(err){
                        res.status(500).send({message:"INTERNAL SERVER EROR"});
                    } else if (deleteComment){                       
                        Users.findByIdAndUpdate(user_Id, { $pull:{ tweet:tweets_Id } }, {new:true}, (err, deleteRetweet) => {
                            if(err){
                                
                                return res.status(500).send({message:"INTERNAL SERVER EROR", err});
                            
                            } else if (deleteRetweet){
                                
                                return res.status(200).send({Retweet_Eliminado:deleteRetweet});
                            
                            } else {
                                return res.status(404).send( {message:"THE DATA FROM THE TWEET HAS NOT BEEN ADDED TO THE RETWEET, PLEASE TRY AGAIN OR LATER" });
                            }
                        }).populate('tweet');
                    } else {
                        return res.status(404).send({ message:"COMMENT NOT ADDED, ERROR" });
                    }
                })

            } else {

                Tweets.findByIdAndUpdate(tweets_Id, {$push:{commentsRetweet:comment}, noRetweet:Number(noTweet + 1)}, {new:true}, (err, sendComment) => {
                    if(err){
                        res.status(500).send({ message:"INTERNAL SERVER EROR" });
                    }else if(sendComment){                       
                        Users.findByIdAndUpdate(user_Id, { $push:{tweet:tweets_Id}}, {new:true}, (err, sendRetweet) => {
                            if(err){
                                return res.status(500).send({ message:"INTERNAL SERVER EROR" });
                            
                            } else if(sendRetweet) {
                                return res.status(200).send({ Retweet_Agregado:sendRetweet });
                            } else {
                                return res.status(404).send({ message:"THE DATA FROM THE TWEET HAS NOT BEEN ADDED TO THE RETWEET, PLEASE TRY AGAIN OR LATER"});
                            }
                        }).populate('tweet');
                    } else {
                        res.status(404).send({ message:" TWEET COMMENT NOT ADDED" });
                    }
                })
            }    
        
        }).populate('tweet');
    } else {
        res.status(404).send({ message:"DATA FROM THE NOT LOCATED TWEETS" });    
    }
});
break;

//
   case "REGISTER":
        var user = new Users();
        var user_name = command_list[1];
        var user_email = command_list[2];
        var user_username = command_list[3];
        var user_password = command_list[4];
        if(user_name != null && user_email != null && user_username != null){
            Users.findOne({$or:[{ user_email: user_email}, { user_username: user_username }]}, (err, saveAllready) => {
                if(err){
                    res.status(500).send({ message: "TRY AGAIN, ERROR" });
                } else if (saveAllready){
                    res.status(200).send({ message: "THIS USER AND EMAIL ARE ALREADY STORED" });
                } else {
                    
                    user.user_name = user_name;
                    user.user_email = user_email;
                    user.user_username = user_username;
                bcrypt.hash(user_password, null, null, (err, passAllready) => {
                    if(err){
                        res.status(500).send({ message: "PASSWORD ENCRYPTION FAILURE" });

                    } else if (passAllready){

                        user.user_password = passAllready;

                            user.save((err, userAllreadySave) => {
                            if(err){
                                res.status(500).send({ message: "ERROR AT THE TIME OF STORING THE REQUIRED" });
                            } else if (userAllreadySave){
                                res.status(200).send({ message: "USER SUCCESSFULLY CREATED"});
                            } else {
                                res.status(404).send({ message: "THIS USER HAS NOT BEEN STORED"});
                            }
                        });
                    }else{
                        res.status(418).send({ message: "SERVER ERROR" })
                    };
                });
            };
        });
        }else{
            res.send({ message: "SCARCE DATA, ENTER THE REQUIRED DATA" });
        };
    break;
//
 case "LOGIN":
        
        var user_username = command_list[1];
        var user_password = command_list[2];
        
        if( user_username != null || user_password != null ){
            Users.findOne({$or:[{user_username:user_username}, {user_password: user_password}]}, (err, passChecker) => {
                if(err){
                    res.status(500).send({message: "INTERNAL SERVER ERROR"});
                } else if (passChecker){
                    bcrypt.compare(user_password, passChecker.user_password, (err, onPassword) => {
                        if(err){
                            res.status(500).send({ message: "INTERNAL SERVER ERROR" });
                        } else if (onPassword){
                            if(params.gettoken = true){
                                res.send({ token: jwt.createToken(passChecker) });
                            } else {
                                res.send({ message: "YOU HAVE LOGGED IN, YOU ARE ONLINE"})
                            };
                        } else {
                            res.send({message: "WRONG PASSWORD, TRY AGAIN"});
                        }
                    });
                } else {
                    res.send({ message: "THE DATA ENTERED EITHER USER, EMAIL AND PASSWORD ARE WRONG" });
                }
            });
        } else {
            res.send({ message: "ENTER EXISTING USER DATA" });
        }
    break;
//
   case "PROFILE":
        
        var user_username = command_list[1];

        Users.findOne({user_username: user_username}, { _id:0, user_password:0}, (err, findaUser) => {
            if(err){
                res.status(500).send({message:err});

            } else if (findaUser){
                res.send({user: findaUser});
            } else {
                res.status(200).send({message: "I DO NOT HAVE RECORDS OF THE USER YOU ARE TRYING TO SEARCH"})
            }
        }).populate('tweet');
    break;
//
 case "FOLLOW":
        var user_username = command_list[1];
        
        Users.findOne({ user_username:user_username },{ user_name:1, user_username:1, tweet:0, _id:1 }, (err, inquireUsName) => {
            if(err){
                res.status(500).send({message:"INTERNAL SERVER ERROR"});
            
            } else if (inquireUsName){

                Users.findOne({_id: req.user.sub, follow:{$elemMatch:{user_username:user_username}}},(err, wantlLocate) => {
                    if(err){
                        res.status(500).send({message:"INTERNAL SERVER ERROR"});
                    } else if (wantlLocate){
                        res.status(200).send({message:"THIS USER IS IN YOUR FOLLOWING LIST"});

                    } else {
                        Users.findByIdAndUpdate(req.user.sub, { $push:{follow: inquireUsName} }, {new:true}, (err, pFollow_Update) => {
                            if(err){
                                res.status(500).send({ message:"INTERNAL SERVER ERROR" });

                            } else if (pFollow_Update){
                                res.status(200).send({ message:"YOU HAVE  FOLLOW THIS USER",});
                            
                            } else {
                                res.status(404).send({ message: "YOU HAVE NOT STORED THIS USER"});
                            };
                        });
                    }
                });
            } else {
                res.status(404).send({ message:"USER NOT FOUND" });
            }
        }).populate('tweet');     
    break;
//
  case "UNFOLLOW":     
        var user_username = command_list[1];

        Users.findByIdAndUpdate(req.user.sub, {$pull:{follow:{user_username:user_username}}}, {new:true}, (err, unFollowUser) => {
            if(err){
                res.status(404).send({ message:"INTERNAL SERVER ERROR" });
            } else if ( !unFollowUser ) {
                res.status(500).send({ message: "YOU HAVE NOT BEEN ABLE TO STOP FOLLOWING THIS ACCOUNT" });
            } else {
                res.status(200).send({ message:"NO LONGER FOLLOW THIS USER", unFollowUser });
            }
        }).populate('tweet');
    break;
//
 case "SEARCH_USER":    
        var searchAuser = command_list[1];

        Users.find({$or:[{user_username:{$regex: "^" + searchAuser, $options: 'i'}}]}, ( err, serchingAuser ) => {
            if(err){
                return res.status(500).send({ message: "INTERNAL SERVER ERROR" });
            
            } else if (serchingAuser){
                res.status(200).send({ message: "USER FOUND", serchingAuser});
            } else {
                res.send({ message: " ENTER THE EXACT USER DATA" });
            }
        }).populate('tweet');
    break;
//
  case "ADD_TWEET":
        command_list.shift();
        var tweet = new Tweets();
        var chain = command_list.join(" "); 

        tweet.user_username = req.user.user_username;
        tweet.tweet_date = new Date();
        tweet.content = chain;
        tweet.noLike = 0;
        tweet.noDisLike = 0;
        tweet.noReply = 0;
        tweet.noRetweet = 0;

        tweet.save((err, tweetAllSaves) => {
            
            if(err){
                res.status(500).send({message: "INTERNAL SERVER ERROR", err});
            }else if(tweetAllSaves){
                Users.findByIdAndUpdate(req.user.sub, { $push:{tweet: tweetAllSaves._id} }, {new:true}, (err, addNewTweet ) => {
                    if(err){

                        return res.status(500).send({ message: "INTERNAL SERVER ERROR" });
                    
                    }else if(addNewTweet){

                        return res.status(200).send({ message: "TWEET...:", addNewTweet });
                    
                    } else {
                        res.status(404).send({ message:"ENTER YOUR TWEET CONTENT"});
                    }
                }).populate('tweet');
            } else {
                
                return res.status(500).send({ message: "ERROR IN THE PUBLICATION OF YOUR TWEET, TRY AGAIN OR LATER" });
            
            }
        });
    break;   
//
 case 'DELETE_TWEET':    
        var tweets_Id = command_list[1];
        var userna = req.user.user_username;

        Tweets.findOne({username:userna}, ( err, userAllisOk ) => {
            if(err){
                res.status(500).send({message:"INTERNAL SERVER ERROR"})
            }else if(userAllisOk){
                console.log(userAllisOk)
                Tweets.findByIdAndDelete(tweets_Id, (err, tweetDelete)=>{
                    if(err){
                        return res.status(500).send({message: "INTERNAL SERVER ERROR"});
                    } else if (tweetDelete){

                        res.status(200).send({message:"TWEET HAS BEEN DELETED'"});                    
                    } else {

                        res.status(404).send({message: "ERROR WHEN DELETING THE TWEET",err});
                    }
                });
            } else {
                return res.status(404).send({message:"ONLY THE OWNER OF THIS TWEET CAN REMOVE IT"})           
            }
        })
            
    break;
//
 case 'edita_Tweet':   
        command_list.shift();
        var content_id = command_list[0];
        command_list.shift();
        var chain = command_list.join(" ");

        Tweet.findByIdAndUpdate(content_id, {content:chain}, {new:true}, ( err, tweetUpdate ) => {
            if(err){
                
                return res.status(500).send({message:"INTERNAL SERVER ERROR"});
            
            } else if (tweetUpdate){

                return res.status(200).send({tweet:tweetUpdate});
            
            } else {

                res.status(404).send({message:"TWEET UPDATE ERROR TRY AGAIN"});
            
            }
        });
    break;
//
case 'VIEW_TWEETS':    
    var user_username = command_list[1];

    Users.findOne({user_username:user_username}, {tweet:1}, (err, dataUser)=>{
        console.log(dataUser);
        if(err){
            res.status(500).send({message:"INTERNAL SERVER ERROR", err});
        } else if (dataUser){

            Tweets.find({_id:dataUser.tweet}, {_id:1, user_username:1, content:1, noReply:1, noRetweet:1, noTweet:1, noDisLike:1, noLike:1}, (err, dataTweets)=>{
                if(err){
                    res.status(500).send({message:"INTERNAL SERVER ERROR"});
                } else if (dataTweets){
                    res.status(200).send({Cantidad_de_datos_del_usuario:user_username , dataTweets});
                } else {
                    res.status(404).send({message:"USER TWEETS NOT DETECTED"});
                }
            });
        } else {
            res.status(404).send({message:"THE REQUEST COULD NOT BE FOUND"});
        }
    }).populate('tweet');;

break;


};
};
module.exports = {
    mycommandos
};