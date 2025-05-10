require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
var path = require('path');

// var routes = require('../app/routes/routes');

const app = express();
// app.use(cors());
// app.use(express.json());

const PORT = process.env.PORT || 5000;

console.log("MONGO DB URI =",process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json()); // to parse json data from the request
app.use(express.urlencoded({ extended: true}));
app.set('views', path.join(__dirname,'/app/views'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', routes);

app.get('../', (req, res) => {
  res.send('Full Stack App Running');
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

