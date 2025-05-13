/**
 * USYD COMP5347 Assignment 2 - Mobile Website
 * Created 10th May 2025
 */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

var routes = require('./routes/routes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB server connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json()); // to parse json data from the request
app.use(express.urlencoded({ extended: true}));
// app.set('views', path.join(__dirname,'/app/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.listen(PORT, function () {
	console.log('Application is listening on url http://localhost:'+PORT+'/')
});