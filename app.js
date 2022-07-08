const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const userRoutes = require('./routes/user_route');
const sauceRoutes = require('./routes/sauce_route');
const path = require('path');
const app = express();
require('dotenv').config();


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,

{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(helmet({
  crossOriginResourcePolicy: false,
}));


app.use(express.json()); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);




module.exports = app;