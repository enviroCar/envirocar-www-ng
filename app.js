var express = require('express');
var logger = require('morgan');
var path = require('path');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.set('views', '');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, '/app/')));

app.get('/', function (request, response) {
    response.sendFile('index.html', {root: __dirname + '/'});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found ' + req.url);
    err.status = 404;
    next(err);
});

app.listen(app.get('port'), "127.0.0.1");

module.exports = app;