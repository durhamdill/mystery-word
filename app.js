// REQUIRED FILES/PACKAGES:
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('express-mustache');

// SUPPLY DATA FOR GAME:
const dictionary = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

// MUSTACHE PARTICULARS:
app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');

// BODY PARSER PARTICULARS:
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));

// GRANT ACCESS TO STATIC FILES:
app.use(express.static(__dirname + '/public'));

// INITIATE APP
const app = express();



console.log(dictionary.length);

var rand = words[Math.floor(Math.random() * dictionary.length)];

console.log(rand);

// words.length=235,887
