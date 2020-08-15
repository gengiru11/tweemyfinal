'use strict'

var express = require('express');
var userController = require('../controllers/users.controller');
var api = express.Router();
var middlewares = require('../middlewares/authenticated')


api.post('/mycommands', middlewares.ensureAuth, userController.mycommandos);
module.exports = api;