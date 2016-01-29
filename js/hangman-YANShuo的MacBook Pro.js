// Read the stored knowledge in the knowledge importer
            var gameData = JSON.parse(sessionStorage.getItem('myData'));
            FORM = document.getElementById("button");
            if (gameData!==null) {
            var dataLen = gameData.length;
            //var myCounter = new Int8Array(dataLen);
            var index = Math.floor(dataLen * Math.random());                // Random generated index
            var currentId;
			var gameDataKey = [];                                           // Array of questions
	        var gameDataValue = [];  
            var counter = new Array(dataLen);			// Counter array of questions
			for(var i=0;i<counter.length;i++){
				counter[i]=0;
			}
			var count = 1;
            var qWeight = 3;
			var QUESTION = 0;
	        var ANSWER = 0;
            var timeWin = qWeight * dataLen;
			var wrongNum = 0;
		} else
		{
			sweetAlert("Oops!", "No data imported", "error");
		}

document.getElementById("myMedia").style.visibility = "hidden";
document.getElementById("myMedia").style.display="none";

            
function gameStart() {
    //alert("Game on!");
  //var goodAns = counter.reduce(function(a, b) {return a + b});    // Number of correct answers
  if (gameData !== null) {
  for (var i = 0; i < dataLen; i++) {
    gameDataKey[i] = gameData[i]['key'];
    gameDataValue[i] = gameData[i]['value'];
  }
  $("#gameStart").modal('show');
  //console.log(gameDataKey);
  //console.log(gameDataValue);
  //console.log(gameData);
  //console.log(dataLen);
  document.getElementById("myMedia").style.display="";
  document.getElementById("myMedia").style.visibility = "visible";
  var index = Math.floor(dataLen * Math.random());
  getQuestion();
  $('#button').prop('disabled', false);
}
/*else {
	sweetAlert("Oops!", "There is no game data!", "error");
}*/
}
document.getElementById("startButton").addEventListener("click", gameStart, false);

 /*
   * Hangman graphic with methods addBodyPart() and reset()
   */
  var hangmanGraphic = function () {
    var bodyParts = 0,
        maxParts = 7;
    return {
      addBodyPart : function () {
        if (bodyParts < maxParts) {
          ++bodyParts;
          $("#hangman-frame" + bodyParts).css("opacity", 1);
        }
      },

       reset : function () {
        $(".hangman-frames").css("opacity", 0);
        $("#hangman-frame0").css("opacity", 1);
        document.getElementById("myMedia").style.visibility = "hidden";
        document.getElementById("myMedia").style.display="none"; 
        bodyParts = 0;
       $('#letters > div').each(function(index, element){
        $(element).remove();
    });
        document.querySelector('#question').innerHTML = "";
        document.querySelector("#check").innerHTML = "";
        counter = new Array(dataLen);
      for(var i=0;i<counter.length;i++){
        counter[i]=0;
      }   
        count = 1;
    wrongNum=0;
    $('#button').prop('disabled', true);
      }
    };
  }();
   $(".reset").on("click", hangmanGraphic.reset);

  // Next 2 lines will be refactored into interface for
  //   losing a life and reseting the game
  //$(".reset").on("click", hangmanGraphic.reset);



function getQuestion() {
    var index = Math.floor(dataLen * Math.random());
  if (counter[index] == qWeight) {
      //index = Math.floor(dataLen * Math.random());
      while (counter[index] == qWeight)
    {
      index = Math.floor(dataLen * Math.random());
    }
  } 
  QUESTION = gameData[index]["key"];
  ANSWER = gameData[index]["value"];
    document.querySelector("#question").innerHTML = "<h2>" + "Q" + count + "." + " " + QUESTION + "</h2>";
  count++;
  currentId = index;  
}

function submitForm() {
    var myAnswer = document.getElementById("answer").value;
    console.log(myAnswer);
  if (myAnswer != ANSWER) {
         //alert("Oops! You entered incorrect answer, please try again!");
      document.querySelector("#check").innerHTML = "<h3>" + "Incorrect! The correct answer is " +  "<span style='color:#FF0000'>" + ANSWER + "</span>" + "</h3><p>";
         //resetForm();
         //SUBMITTED = false;
         //setState(PLAYING);
         counter[currentId] == 0;
         wrongNum++;
         var domElem = document.createElement("div");
               domElem.className = "grave-letter";
               domElem.innerHTML = QUESTION;
               document.getElementById("letters").appendChild(domElem);
               hangmanGraphic.addBodyPart();
               //displayGameOverMessageOnLose();
         //hangmanGraphic.addBodyPart();
         resetForm();
    } else {
        document.querySelector("#check").innerHTML = "<h3>" + "Correct!" + "</h3><p>";
      //alert("Congratulation! You can eat ghosts now!");
       /*SUBMITTED = false;
       setState(PLAYING);*/
       counter[currentId]++;
       console.log(dataLen);
       console.log(currentId);
           console.log(counter);
       resetForm();
    }       
  /*if (counter.reduce(function(a, b) {return a + b}) < timeWin) {
      getQuestion();
    
  } else {
      win();
  }*/
  console.log(counter);
    return false;
}

function resetForm() {
  document.getElementById("answer").value = "";
  //getQuestion();
  if (counter.reduce(function(a, b) {return a + b}) < timeWin) {
    if (wrongNum < 7) {
      getQuestion();
      } else {
        lose();
      }
    
  } else {
      win();
  }
}


FORM.addEventListener("click", submitForm, false);

function win() {
  document.querySelector("#question").innerHTML = "<h3>" + "You Win!" + "</h3><p>";
  document.querySelector("#check").innerHTML = "";
  $("#congratulatory_message").modal('show');
  hangmanGraphic.reset();
}

function lose() {
  if (wrongNum == 7 ) {
    document.querySelector("#question").innerHTML = "<h3>" + "You Lost!" + "</h3><p>";
    document.querySelector("#check").innerHTML = "";
      $("#gameover_message").modal('show');
      var gameOverMessage = "Uh oh. You took too many tries to qnswer the questions. Better luck next time.";
      $(".lead").text(gameOverMessage);
    }
    //hangmanGraphic.reset();
}
$("#gameover").on("click", hangmanGraphic.reset);
