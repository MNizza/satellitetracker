const express = require("express"),
  server = express(),
  bodyParser = require("body-parser"),
  path = require("path"),
  fs = require("fs"),
  cdir = path.join(path.dirname(fs.realpathSync(__filename)), ""),
  port = 9015,
  mongoose = require("mongoose"),
  mongoDB = 'mongodb://127.0.0.1/satellitetracker',
  cron = require("node-cron"),
  expressLayouts = require("express-ejs-layouts"),
  IndexController = require("./api/controllers/Index");
  
mongoose.connect(mongoDB, { useNewUrlParser: true });

let db = mongoose.connection;

db.on('error', console.error.bind(console, "Failed to connect to MongoDB, error:"));

server.set("view engine", "ejs");
server.set("views", __dirname + "/views/");
server.set("layout", "layout");

server.use(express.static(path.join(cdir, "public")));
server.use(expressLayouts);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use("/", IndexController);

server.listen(port, () =>
	console.log(`Satellite Tracker is up and running on port ${port}!`)
);
