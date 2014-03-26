var express = require("express")
var app = express()

var dotenv = require('dotenv');
dotenv.load();

var port = process.env.PORT || 3000

app.configure(function() {
  app.use(express.static(__dirname + "/public"))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.cookieParser(process.env.SESSION_SECRET));
  app.use(express.session({secret: process.env.SESSION_SECRET}));
  app.set("views", __dirname + "/views")
  app.set("view engine", "jade")
})

app.configure("development", function() {
  app.use(express.logger())
})

app.configure("production", function() {
  app.use(express.logger())
})

require('./lib/routes')(app)

/*
 * Start the server, unless we are in tests mode
 * If NODE_ENV is test, the server will be controlled by the tests
 */
if (app.get("env") != "test") {
  app.listen(port)
  console.log('Server running on ' + port)
}

exports = module.exports = app

