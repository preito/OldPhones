/**
 * USYD COMP5347 Assignment 2 - Mobile Website
 * Created 10th May 2025
 */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
var routes = require('./routes/routes');
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json()); // to parse json data from the request
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
connectDB();

app.listen(PORT, function () {
	console.log('Application is listening on url http://localhost:'+PORT+'/')
});