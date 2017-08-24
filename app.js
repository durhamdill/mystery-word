// REQUIRED FILES/PACKAGES:
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const session = require('express-session');
const port = 3000;

// INITIATE APP:
const app = express();

// INITIATE SESSION:
app.use(session({
 secret: 'dog person',
 resave: false,
 saveUninitalized: true,
}));

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
  randomWord(req, res);
  console.log(req.session.word);
  console.log(req.session.wordArray);
  res.render('game', {word:req.session.word, letters: req.session.wordArray});
})



//Generate random word and matching array with blank spaces:
function randomWord(req, res) {
  let word = dictionary[Math.floor(Math.random() * dictionary.length)];
  req.session.word = word;
  req.session.wordArray = [];
  for (i=0; i<req.session.word.length; i++){
    req.session.wordArray.push("");
  }
  // console.log(req.session.wordArray);
}

function wordDisplay(req, res) {

}


app.listen(port, function(req, res){
   console.log('Starting mystery word game...');
  });
