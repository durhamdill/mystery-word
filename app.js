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
  console.log("Mystery Word: " + req.session.word);
  // console.log(req.session.wordArray);
  res.render('game', {word:req.session.word, letters: req.session.wordArray, lives:req.session.lives});
})

app.post('/', function(req, res){
  checkGuess(req, res);
  statusUpdate(req, res);
  res.render('game', {word:req.session.word, letters: req.session.wordArray, guesses:req.session.guesses, lives: req.session.lives, message: req.session.message});
})



//Generate random word and matching array with blank spaces:
function randomWord(req, res) {
  let word = dictionary[Math.floor(Math.random() * dictionary.length)];
  req.session.word = word;
  req.session.wordArray = [];
  req.session.guesses = [];
  req.session.lives = 8;
  for (i=0; i<req.session.word.length; i++){
    req.session.wordArray.push("");
  }
  // console.log(req.session.wordArray);
}

function checkGuess(req, res) {
  req.session.matches = 0;
  let guess = req.body.letter.toLowerCase();
  let word = req.session.word;
  let array = req.session.wordArray;
  req.session.guesses.push(guess.toUpperCase());
  console.log("Guess: " + guess);
  for (i=0; i<req.session.word.length; i++){
    if (guess===word[i]){
      array[i]=guess.toUpperCase();
      req.session.matches++;
      console.log("Letter " + guess + " found!");
    } else {
      console.log("Letter " + guess + " not found!");
    }
  }
  console.log("Total matches: " + req.session.matches);
}

function statusUpdate(req, res) {
  // console.log("hi");
  // console.log(req.session.matches);
  if (req.session.matches==0){
    req.session.lives-=1;
    req.session.message = "Sorry no match, try again!";
    console.log(req.session.lives);
  } else {
    req.session.message = "Nice job. Guess again!"
  }
}

function validateGuess(req, res) {
  
}

app.listen(port, function(req, res){
   console.log('Starting mystery word game...');
  });
