// REQUIRED FILES/PACKAGES:
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const session = require('express-session');
const validator = require('validator');
const expressValidator = require('express-validator');
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

// BODY PARSER/VALIDATOR PARTICULARS:
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());

// GRANT ACCESS TO STATIC FILES:
app.use(express.static(__dirname + '/public'));


//GET-POST/ROUTE SETUP:
app.get('/', function(req, res){
  randomWord(req, res);
  console.log("Mystery Word: " + req.session.word);
  // console.log(req.session.wordArray);
  res.render('game', {word:req.session.word, letters: req.session.wordArray, lives:req.session.lives});
})

app.post('/', function(req, res){
  validateGuess(req, res);
  // compareGuess(req, res);
  // statusUpdate(req, res);
  res.render('game', {word:req.session.word, letters: req.session.wordArray, guesses:req.session.guesses, lives: req.session.lives, message: req.session.message});
})

//GENERATE RANDOM WORD AND MATCHING ARRAY WITH BLANKS:
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

function validateGuess(req, res) {
  // console.log(req.session.guesses);
  if (req.session.guesses.includes(req.body.letter.toUpperCase())){
    console.log("not valid: double guess");
    req.session.message = "You already tried that one. Try again!";
  } else if (validator.isAlpha(req.body.letter) && validator.isLength(req.body.letter, { min: 1, max: 1})){
      console.log("valid");
      compareGuess(req, res);
  } else {
    console.log("not valid: invalid input");
    req.session.message = "Invalid guess. Please choose one letter from the alphabet.";
  }
}

//COMPARE GUESS AGAINST MYSTERY WORD:
function compareGuess(req, res) {
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
  statusUpdate(req, res);
}

//SEND STATUS UPDATE BACK TO PLAYER:
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


//CONNECT TO SERVER:
app.listen(port, function(req, res){
   console.log('Starting mystery word game...');
  });
