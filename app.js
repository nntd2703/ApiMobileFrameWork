var express = require('express'),
    app = express()
    mysql = require('mysql'),
    bodyParser = require('body-parser')


var local_ip = "http://192.168.0.116:8889/"
global.local_ip = local_ip

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'MF_clone_tiki',
    json: true
})


connection.connect()
global.db = connection

// view engine setup
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }));

//Middelware
app.use(bodyParser.json())
const appRoutes = require('./routes/api.js')(app)

connection.on('error', function (err) {
    console.log("[mysql error]", err);
});

module.exports = app;

