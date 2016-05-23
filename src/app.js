var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var mongoose = require('mongoose');
var requestLogger = require('morgan');
var winston = require('winston');

// app routes and configuration
var config = require('./config');

winston.loggers.add('mainLogger', {
    console: {
        level: 'debug',
        colorize: true
    },
    file: {
        filename: './logs/timetracker.log',
        handleExceptions: true,
        humanReadableUnhandledException: true
    }
});

const logger = winston.loggers.get('mainLogger');

// create the database connection
mongoose.connect(config.mongodb);
mongoose.connection.on('connected', () => {
  app.emit('log', 'info', `mongoose connection open to ${config.mongodb}`);
});

// if the connection throws an error
mongoose.connection.on('error', err => {
  app.emit('error', err);
});

// when the connection is disconnected
mongoose.connection.on('disconnected', function () {
  app.emit('log', 'info', 'mongoose connection disconnected');
});

require('./models/user');
require('./models/workDay');

var app = express();

app.use(requestLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var trackerController = require('./routes/trackerController');

app.post('/api/v1/track', hasValidToken, trackerController.handleAction);

function hasValidToken(req, res, next) {
    var token = req.body.token;
    if (!token || token !== config.slackApiToken) {
        res.status(401).send('Invalid API token.');
        return;
    }

    return next();
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).send('Not found.');
});

// error handlers

// development error handler
// will print stacktrace
if (config.env === 'development') {
    logger.debug('**** RUNNING IN DEVELOPMENT MODE ****');
    app.use(function (err, req, res, next) {
        res.status(err.status || 500).send({
            message: err.message,
            error: err
        });
    });
}
else {
    logger.info('Starting process in production mode.');
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500).send({
        message: err.message,
        error: {}
    });
});


module.exports = app;