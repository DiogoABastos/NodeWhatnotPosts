const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const connectDB = require('./config/db');
const globalVars = require('./config/globalVars');

// Load env
dotenv.config({ path: './config/config.env' });

// Load passport
require('./config/passport')(passport);

connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Express Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ejs
app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

//method-override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

// Express Session
app.use(session({
  secret: 'Hello',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// Global vars
app.use(globalVars);

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));

