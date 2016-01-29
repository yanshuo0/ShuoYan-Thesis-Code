// Read the stored knowledge in the knowledge importer
var gameData = JSON.parse(sessionStorage.getItem('myData'));
// Define the Submit Button
FORM = document.getElementById("button");

if (gameData !== null) { 
	$('#startButton').prop('disabled', false);
    var dataLen = gameData.length;                                  // Get the length of gameData Array
    var currentId;                                                  // Index of current question
    var gameDataKey = [];                                           // Array of questions
	var gameDataValue = [];                                         // Array of answers
    var counter = new Array(dataLen);			                    // Counter array of correct answer times for each question
	for(var i=0;i<counter.length;i++){                              // Initialise the counter array
		counter[i]=0;
	}
	var count = 1;                                                  // The index of currect question displayed, such as "Q1: the first question"
    var qWeight = 3;                                                // Time of correct answers required for each question
	var QUESTION = 0;                                               // Initialise the current question
	var ANSWER = 0;                                                 // Initialise the current answer
    var timeWin = qWeight * dataLen;                                // Total number of correct answers required to win the game
    var wrongNum = 0;                                               // Time of incorrect answers given
} else {         
	swal({                                                          // Error message of no game data
      title: "Error",
      text: "No data imported",
      type: "error" 
    },
      function(){
        window.location.href = 'index.html';
    });
}

document.getElementById("myMedia").style.visibility = "hidden";     // The Hangman and grave image are hidden
document.getElementById("myMedia").style.display="none";

            
function gameStart() {
  // Function to start a new game
  for (var i = 0; i < dataLen; i++) {
    gameDataKey[i] = gameData[i]['key'];                            // Assign questions to question array
    gameDataValue[i] = gameData[i]['value'];                        // Assign answers to answer array
  }
  $("#gameStart").modal('show');                                    // Game start modal information
  document.getElementById("myMedia").style.display="";              // Display hangman and grave images
  document.getElementById("myMedia").style.visibility = "visible";
  //var index = Math.floor(dataLen * Math.random());                  // Get a random index in range of game data length
  getQuestion();                                                    // Call getQuestion function
  $('#button').prop('disabled', false);                             // Enable the Submit button
}
// Add event listener to the Start button
document.getElementById("startButton").addEventListener("click", gameStart, false);

 /*
   * Hangman graphic with methods addBodyPart() and reset()
   */
  var hangmanGraphic = function () {
    var bodyParts = 0,
        maxParts = 7;                                               // The initial hangman has o part, the total number is 7 parts
    return {
      addBodyPart : function () {
        if (bodyParts < maxParts) {
          ++bodyParts;                                              // Add a part to the hangman image
          $("#hangman-frame" + bodyParts).css("opacity", 1);        // Update the hangman image displayed
        }
      },

       reset : function () {
        $(".hangman-frames").css("opacity", 0);                     // Reset hangman image
        $("#hangman-frame0").css("opacity", 1);
        document.getElementById("myMedia").style.visibility = "hidden";   // Hide hangman and grave images
        document.getElementById("myMedia").style.display="none"; 
        bodyParts = 0;          
       $('#letters > div').each(function(index, element){
        $(element).remove();                                        // Remove all recorded wrongly answered questions
    });
        document.querySelector('#question').innerHTML = "";         // Empty the question display div
        document.querySelector("#check").innerHTML = "";            // Empty the answer checker div
        for(var i=0;i<counter.length;i++){                          // Reset counter array        
          counter[i]=0;
        }   
        count = 1;                                                  // Reset the index of question displayed to 1
        wrongNum=0;                                                 // Reset the number of incorrect answer
        $('#button').prop('disabled', true);                        // Disable the Submit button
      }
    };
  }();
   $(".reset").on("click", hangmanGraphic.reset);                   // Add event listener to Reset button

function getQuestion() {
	// Function to generate a question
    var index = Math.floor(dataLen * Math.random());                // Generate a random index 
  if (counter[index] == qWeight) {
      //index = Math.floor(dataLen * Math.random());
      while (counter[index] == qWeight)
    {
      index = Math.floor(dataLen * Math.random());                  // If the question chosen has been answered correctly 3 times, then choose another one
    }
  } 
  QUESTION = gameData[index]["key"];                                // Get the chosen question
  ANSWER = gameData[index]["value"];                                // Get the correct answer for the chosen question
  // Display question on Web page
  document.querySelector("#question").innerHTML = "<h2>" + "Q" + count + "." + " " + QUESTION + "</h2>";
  count++;                                                          // Add the index displayed for current question
  currentId = index;                                                // Get the index for the current question in the question array
} 

function submitForm() {
	// Function to submit user answer
    var myAnswer = document.getElementById("answer").value;         // Get user submitted answer
    console.log(myAnswer);
  if (myAnswer != ANSWER) {
  	// If the answer is incorrect
    document.querySelector("#check").innerHTML = "<h3>" + "Incorrect! The correct answer is " +  "<span style='color:#FF0000'>" + ANSWER + "</span>" + "</h3><p>";
    counter[currentId] = 0;                                        // Reset the corresponding counter to 0
    wrongNum++;                                                    // Add the number of wrongly answered question
    var domElem = document.createElement("div");                   // Create a div for displaying wrongly answered question
    domElem.className = "grave-letter";
    domElem.innerHTML = QUESTION;                                  // Display the wrongly answered questions
    document.getElementById("letters").appendChild(domElem);         
    hangmanGraphic.addBodyPart();                                  // Add a part on the hangman image
    resetForm();                                                   // Empty the input box
    } else {
    	// If the answer is correct
        document.querySelector("#check").innerHTML = "<h3>" + "Correct!" + "</h3><p>";
        counter[currentId]++;                                      // Counter for corresponding question adds 1
        console.log(currentId);  
        console.log(counter);
        resetForm();                                               // Empty the input box
    }       

  console.log(counter);
    return false;
}

function resetForm() {
	// Function to reset the input box
  document.getElementById("answer").value = "";                    // Empty the input box
  //getQuestion();
  if (counter.reduce(function(a, b) {return a + b}) < timeWin) {
    if (wrongNum < 7) {                                            // If the number of correct answers is inferior to the total number required to win the game, keep running
      getQuestion();
      } else {
        lose();                                                    // If 7 wrong answers are given, game ends
      }
    
  } else {
      win();                                                       // If the number of correct answers equals to the total number required to win, game ends
  }
}


FORM.addEventListener("click", submitForm, false);                 // Add event listener to the Submit button

function win() {
	//Function of winning game
    document.querySelector("#question").innerHTML = "<h3>" + "You Win!" + "</h3><p>";     // Display the winning information
    document.querySelector("#check").innerHTML = "";                                      // Empty the answer checker div
    $("#congratulatory_message").modal('show');                                           // Show the winning modal info
    hangmanGraphic.reset();                                                               // Reset hangman image
}

function lose() {
	// Function of losing game
    if (wrongNum == 7 ) {
      document.querySelector("#question").innerHTML = "<h3>" + "You Lost!" + "</h3><p>";  // Display the losing information
      document.querySelector("#check").innerHTML = "";                                    // Empty the answer checker div
      $("#gameover_message").modal('show');                                               // Show the winning modal info
      var gameOverMessage = "Uh oh. You took too many tries to qnswer the questions. Better luck next time.";
      $(".lead").text(gameOverMessage);
    }
}
$("#gameover").on("click", hangmanGraphic.reset);                                         // Add event listener to the button of losing modal                
