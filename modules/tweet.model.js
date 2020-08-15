'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var My_tweetSchema = Schema({
    user_username: String,
    content: String,
    tweet_date: String,
    noLike: Number,
    noDisLike: Number,
    noReply: Number,
    noRetweet: Number,
    tweet_likes:[{}],
    tweet_dislike:[{}],
    responce:[{}],
    commentsRetweet:[{}]
});

module.exports = mongoose.model('tweet', My_tweetSchema);

