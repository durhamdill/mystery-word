// REQUIRED FILES/PACKAGES:
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const port = 3000;

// INITIATE APP
const app = express();

// SUPPLY DATA FOR GAME:
const dictionary = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

// console.log(dictionary.length);
// dictionary.length=235,887

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

app.get('/', function(req, res){
  res.render('game');
  randomWord();
})





function randomWord() {
  let word = dictionary[Math.floor(Math.random() * dictionary.length)];
  console.log(word);
}

// randomWord();


app.listen(port, function(req, res){
   console.log('Starting mystery word game...');
  });
