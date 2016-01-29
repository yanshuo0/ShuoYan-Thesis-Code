
var gameData = JSON.parse(sessionStorage.getItem('myData'));    // Read the stored knowledge in the knowledge importer
if (gameData !== null) {
var dataLen = gameData.length;                                  // Get the length of gamedata
var qWeight = 3;                                                // Times need to be answered for each question
var timeWin = qWeight * dataLen;                                // Times of correct answers to win
var counter = new Int8Array(dataLen);                           // Counter array of questions
var index = Math.floor(dataLen * Math.random());                // Random generate an index
var currentId = 0;                                              // Initialize the current index of question
var mouseQues;
var temp;
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
 
             // =======================================================================================
             // =======================================================================================           
            
                    function tellerror(msg, url, linenumber) {
            //========================================
            // For netscape and mozilla
            // Alert the error type, display when the error happens and the line that error locates.
                        //alert('Error message= ' + msg + '\nURL= ' + url + '\nLine Number= ' + linenumber);
                        return true;
                    } // tellerror
            
                    if (document.addEventListener) window.onerror=tellerror;  // If not, use IE
            
                    // Constant Definition
                    cteTopPosY = -20;  // position that knowledge displays from above.
                    cteInfoDeltaY = -35; // position that knowledge end at the bottom of screen
            
                    // variables storing the positions and contenu of knowledge.
                    if (gameData!=null) {
                        var anNbPosX = new Array(gameData.length);
                        var anNbPosY = new Array(gameData.length);
                        var anNbKey = new Array(gameData.length);
                        var anNbValue = new Array(gameData.length);
                    } 
                    var nMouseValue = 0;       // Correct answer that displayed on mouse
            
                    var nNbIndex = 0;          // Count of numbers that fall
            
                    var nNbAtBottom = 0;       // Count of numbers that reach bottom of screen
                    var nNbWrong  = 0;         // Count of numbers answering wrong
                    var nNbCorrect = 0;        // Count of numbers answering correct
                    var nTimes   = 0;          // Time in unit of 1/10 second
            
                    var nTimerID = 0;
                    var nPixLimitBottom = 530;  // limit of bottom of the screen
            
                    var nTime = 0;              // For vary the speed of numbers
                    var nDeltaTime = 100;       // Speed. 100 = normal, 50 = half speed, 200 = double speed.
            
                    var nOptErr = 1;            // Importance of error. 

            // =======================================================================================
            // =======================================================================================          


                    function myRightMouseDown(evt) { // For opera .
            //============================
                        var MyNumber=0;
                        if (evt) MyNumber = evt.button;
                        else     MyNumber = event.which;
            
                        if ((MyNumber == 2) || (MyNumber == 3))  {
                           alert("Right button is inactive");
                           evt.preventBubble();    // Cannot function
                           evt.stopPropagation();  // Cannot function
                           // if (evt)  evt.preventDefault();  // It works !!!  Work for Netscape 6+
                        }
                        return false;
                    } // myRightMouseDown
            
                    function myContextMenu(evt) { // For netscape 6+ and IE but no opera .
            //===========================
            // Cancel the context menu.
                        if (evt)  evt.preventDefault();  // It works for Netscape
            
                        return false;
                    } // myContextMenu
            
            // =====================================================================================================================
            // =====================================================================================================================

                    function Win() {
                        for (var i=1; i <=nNbIndex; i++) {
                            oDivNb = document.getElementById("divNb" + i);
                            anNbPosX[i] = 80*i-40;               // regeneration in the right column
                            anNbPosY[i] = -50;                   // regenerate from above screen
                            oDivNb.style.left = anNbPosX[i];
                            oDivNb.style.top  = anNbPosY[i];

                        }
                        DisplayInfo();
                        
                    	if (nTimerID != 0) {
                            clearInterval(nTimerID);
                            nTimerID = 0;
                        }
            
                        var oDivS = document.getElementById("divMouse_follow");
                        oDivS.innerHTML = "";
            
                        var oDivTerm = document.getElementById("divEnd");
                        oDivTerm.innerHTML = '<table width="400" border="5">' +
                                '<tr><td bgcolor="#000099"><font size="+3"; color="#ffff90">' + 'You Win!' +
                                '</td></tr></table>';
            
                         // decide whether to display the commentaries
                        if ((document.MaForm1.showComment.selectedIndex == 0) || (nTimes < 300)) return;
                    }

                    function Termine() {
            //================
            // When a number arrives at the bottom of the screen, displays a resume of results.
            
                        if (nTimerID != 0) {
                            clearInterval(nTimerID);
                            nTimerID = 0;
                        }
            
                        var oDivS = document.getElementById("divMouse_follow");
                        oDivS.innerHTML = "";
            
                        var oDivTerm = document.getElementById("divEnd");
                        oDivTerm.innerHTML = '<table width="400" border="1">' +
                                '<tr><td bgcolor="#000099"><font size="+1"; color="#ffff90">' +
                                'Termine apr&egrave;s : ' + nTimes/10 + ' secondes<br>' +
                                'Count of correct answers = ' + nNbCorrect + '<br>' +
                                'Count of incorrect answers = ' + nNbAtBottom + '<br>' +
                                'Average time of correct answers = ' +
                                Math.round(10*nTimes/(nNbCorrect + 0.00001)) / 100 + ' [s]' +
                                '</td></tr></table>';
            
                        // decide whether to display the commentaries
                        if ((document.MaForm1.showComment.selectedIndex == 0) || (nTimes < 300)) return;
                        
                    } // Termine

            // =====================================================================================================================
            // =====================================================================================================================
 
            
                    function DisplayInfo() {
            //====================
            // display information at the bottom of screen
                        oDivInfo = document.getElementById("divInfo");
                        oDivInfo.innerHTML = "Correct : " + nNbCorrect + " &nbsp; &nbsp; Incorrect : " + nNbWrong +
                                " &nbsp; &nbsp; Average : " + Math.round(10*nTimes/(nNbCorrect + 0.00001)) / 100 +
                                " &nbsp; &nbsp; Time : ";
                    } // DisplayInfo



            
                    function myWrite() {
            //==================
            // move numbers to the bottom
                        nTimes += 1; // plus 1/10 second
                        odivTime = document.getElementById("divTime");
                        odivTime.innerHTML = nTimes/10;
            
                        nTime = nTime + nDeltaTime;
                        if (nTime < 0) return true;
            
                        var nDeltaY = 0;
                        while (nTime >= 0) { // accelerate the speed.
                            nTime = nTime - 100;
                            nDeltaY +=3;
                        }
            
                        for (var ii=1; ii <=nNbIndex; ii++) {
                            oDivNb = document.getElementById("divNb" + ii);
                            anNbPosY[ii] += nDeltaY;
                            anNbPosX[ii] += Math.round(5*(Math.random()-0.5));  // move randomly in axe X
                            oDivNb.style.left = anNbPosX[ii];
                            oDivNb.style.top  = anNbPosY[ii];
            
                            if (anNbPosY[ii] > nPixLimitBottom) {
                                // This number has arrived at the bottom
                                anNbPosX[ii] = 80*ii-40; // regeneration in the right column
                                anNbPosY[ii] = cteTopPosY; // regenerate from above screen
                                nNbAtBottom +=1; // count "arrive at bottom" increases 1
            
                                DisplayInfo();
                                Termine();
                            }
                        }
            
                    } // myWrite
            
                    function Mouse_follow(evt) {
            //=======================
                        if (nTimerID == 0) return true;
            
                        var oDivS = document.getElementById("divMouse_follow");
                        var x = 0; var y = 0;
                        var myString = [];
            
            // Read the position of mouse
                        if (evt) { x=evt.clientX; y=evt.clientY; } // in netscape 6
                        else if (window.event){ x=window.event.x; y=window.event.y; } // in IE5
            
            // move the text(equation) to follow the move of mouse
                        oDivS.style.top  = y;
                        oDivS.style.left = x;
            
                    } // Mouse_follow
            
                    function Click_action(evt) {
            //==========================
            // action of click the mouse.
                        if (nTimerID == 0) return true;
            
                        var x = 0; var y = 0;
            
            // Read the position of mouse
                        if (evt) { x=evt.clientX; y=evt.clientY; } // In ns6
                        else if (window.event){ x=window.event.x; y=window.event.y; } // In ie5
            
            // For each correct response, we test the size of window.
                        if (window.innerHeight) nPixLimitBottom = window.innerHeight;
                        else if (document.body && document.body.clientHeight) nPixLimitBottom = document.body.clientHeight;
                        else nPixLimitBottom = 500;
            
                        oDivInfo = document.getElementById("divInfo");
                        oDivInfo.style.top = nPixLimitBottom + cteInfoDeltaY;
                        odivTime = document.getElementById("divTime");
                        odivTime .style.top = nPixLimitBottom + cteInfoDeltaY;
            
            // We let the test run faster
                        if ((x < 3) && (y < 15)) {
                            nTimes+=1200 - 100*y;
                            nNbCorrect +=5 * y;
                            for (var i = 1; i <= nNbIndex; i++) {
                                anNbPosY[i] += 50;
                                oDivLeNb = document.getElementById("divNb" + i);
                                oDivLeNb.style.top = anNbPosY[i];
                            }
                            DisplayInfo();
                            return;
                        }
            
            // For all the numbers, test whether the user click on a number
                        for (var k=1; k <= nNbIndex; k++) {
                            // Test whether a number is clicked
                            if ((Math.abs(x-anNbPosX[k]- 25) < 20) && (Math.abs(y-anNbPosY[k]- 25) < 20)) {
            
                                // Test whether a correct number is clicked
                                if (nMouseValue == anNbValue[k]) { // correct answer
                                    nNbCorrect +=1;
                                    temp = k;
                                    console.log(temp);
                                    for (var jj = dataLen-1; jj >=0; jj--) {
                                        if (gameData[jj]['key'] == mouseQues) {
                                            currentId = jj;
                                        }
                                        //break;
                                    }
									counter[currentId]++;
									console.log(counter);
									
                                  if(counter.reduce(function(a, b) {return a + b}) < timeWin) {
                                    // change the text on the mouse
                                    var oDivS = document.getElementById("divMouse_follow");
            
                                    anNbPosY[temp] = cteTopPosY; // reset the number from above
            
                                    // Choose a random number.
                                    var index = Math.floor(1+nNbIndex *Math.random());
            
                                    if (nTimes + nOptErr*nNbWrong*(50 + 10*nNbWrong) < 2100) {
                                        // If less than 2100 1/10 seconds = 3.5 minutes, then
                                        // choose one from the lowest two.
                                        var index1 = Math.floor(1+nNbIndex *Math.random());
                                        if (anNbPosY[index1] > anNbPosY[index]) index = index1;
                                    }
            
                                    if ((nNbIndex > 7) && (nTimes + nOptErr*nNbWrong*(30 + 5*nNbWrong) < 1500)) {
                                        // If it is more than 7 numbers but less than 1500 1/10 seconds,
                                        // we give more weight to the lowest one.
                                        var index1 = Math.floor(1+nNbIndex *Math.random());
                                        if (anNbPosY[index1] > anNbPosY[index]) index = index1;
                                    }
  
                                    // New question
									//var nData = index;
                                    var nData = Math.floor(dataLen * Math.random());
									if(counter[nData] < qWeight) {
                                        anNbKey[index] = gameData[nData]['key'];
                                        anNbValue[index] = gameData[nData]['value'];
                                        currentId = nData;
                                    } else {
                                        nData = Math.floor(dataLen * Math.random());
                                        while (counter[nData] == qWeight)
                                        {
                                            nData = Math.floor(dataLen * Math.random());
                                        }
                                        anNbKey[index] = gameData[nData]['key'];
                                        anNbValue[index] = gameData[nData]['value'];
                                        currentId = nData;
                                    }
                                    /*do {
                                        nData = Math.floor(dataLen * Math.random());
                                    } 
                                    while(counter[nData] >= qWeight);
                                    anNbKey[index] = gameData[nData]['key'];    
                                    anNbValue[index] = gameData[nData]['value'];*/
                                    oDivS.innerHTML = anNbKey[index];
                                    mouseQues = anNbKey[index];
                                    nMouseValue = anNbValue[index];
            
                                    anNbPosX[index] = 80*index-40; // reset in the right column
                                    anNbPosY[index] = cteTopPosY; // reset the number from above
                                    oDivLeNb = document.getElementById("divNb" + index);
                                    oDivLeNb.innerHTML = anNbValue[index];
                                    oDivLeNb.style.top = anNbPosY[index];
                                    for (var i = 1; i <= nNbIndex; i++) {
                                           
                                            	myDivLeNb = document.getElementById("divNb" + i);
                                            	myDivLeNb.style.color = "white";
                                            	//myDivLeNb.style.color = "white";
                                            	//setTimeout(function() {return function() {myDivLeNb.style.color = "white"};}, 10000);
                                            }
                                            //oDivLeNb.style.color = "#ff0000";
                                        
            
                                    // increase the count of number with time.
                                    var nTimes2  = nTimes + 30*nOptErr*nNbWrong;
                                    if (((nTimes2 >  150) && (nNbIndex <  5)) ||
                                            ((nTimes2 >  300) && (nNbIndex <  6)) ||
                                            ((nTimes2 >  450) && (nNbIndex <  7)) ||
                                            ((nTimes2 >  600) && (nNbIndex <  8)) ||
                                            ((nTimes2 >  750) && (nNbIndex <  9)) ||
                                            ((nTimes2 >  900) && (nNbIndex < 10)) ||
                                            ((nTimes2 > 1200) && (nNbIndex < 11))) {
                                        nNbIndex = nNbIndex +1;
                                        index = nNbIndex;
                                        anNbKey[index] = gameData[index%dataLen]['key'];
                                        anNbValue[index] = gameData[index%dataLen]['value'];
                                
            
                                        anNbPosX[index] = 150*index-40;
                                        anNbPosY[index] = -10;
                                        strDivText = "<DIV id='divNb" + index + "' STYLE='position:absolute; left:" + anNbPosX[index] + "; top:" + anNbPosY[index];
                                        strDivText +="; color:white; font-size:36; visibility:visible'>" + anNbValue[index] + "</DIV>";
            
                                        var oDivNb = document.getElementById("divNumbers");
                                        oDivNb.innerHTML += strDivText;
                                    }
            
                                    DisplayInfo();
                                    return;
                                } else {
                                	Win();
                                }
                                }
                                else {  // incorrect answer
                                    nNbWrong +=1;
									counter[currentId] = 0;
                                    if (nOptErr == 0) {
                                        // the number clicked down a little
                                        anNbPosY[index] += 50;
                                        oDivLeNb = document.getElementById("divNb" + index);
                                        oDivLeNb.style.top = anNbPosY[index];
                                    }
                                    else {
                                        // the numbers clicked down a little
                                        for (i = 1; i <= nNbIndex; i++) {
                                            anNbPosY[i] += 50;
                                            oDivLeNb = document.getElementById("divNb" + i);
                                            oDivLeNb.style.top = anNbPosY[i];
                                            if (anNbValue[i]==nMouseValue) {
                                            	myDivLeNb = document.getElementById("divNb" + i);
                                            	myDivLeNb.style.color = "#ff0000";
                                            	//myDivLeNb.style.color = "white";
                                            	//setTimeout(function() {return function() {myDivLeNb.style.color = "white"};}, 10000);
                                            }
                                            //oDivLeNb.style.color = "#ff0000";
                                        }
                                    }
								
                                    DisplayInfo();
                                    return;
                                }

                            }
                        }
                      /*} else {
                      	Win();
                      }*/
                    } // Click_action





            
                    function Start() {
            //================
                        var nn = 1;
                        var strDivText = "du texte";
                        var oDivNb = document.getElementById("divNumbers");
                        oDivNb.innerHTML = '';
                        nNbIndex = 4;
                        
                        console.log(nData);
                        console.log(gameData);
            
                        nNbAtBottom = 0; // count of numbers arrive at the bottom
                        nNbWrong  = 0; // count of incorrect answers
                        nNbCorrect = 0; // count of correct answers
                        nTimes   = 0; // time in 1/10 seconds
            
                        for (var nn=1; nn <= nNbIndex ; nn++) {
                        	var nData = Math.floor(dataLen * Math.random());
                              if (gameData!=null) {
                                        anNbKey[nn] = gameData[nData]['key'];
                                        anNbValue[nn] = gameData[nData]['value'];
                                    }  
            
                            anNbPosX[nn] = 120*nn-40;
                            anNbPosY[nn] = -10;
                            strDivText = "<DIV id='divNb" + nn + "' STYLE='position:absolute; left:" + anNbPosX[nn] + "; top:" + anNbPosY[nn];
                            strDivText +="; color:white; font-size:36; visibility:visible'>" + anNbValue[nn] + "</DIV>";
            
                            oDivNb.innerHTML += strDivText;
                        }
            
            // operation to do, which follows the mouse
                        var oDivS = document.getElementById("divMouse_follow");
            
                        kk = Math.floor(1+nNbIndex * Math.random());
                       
                        oDivS.innerHTML = anNbKey[kk];
						for (var i = dataLen - 1; i >= 0; i--) {
						    if(gameData[i]['key'] == anNbKey[kk]) {
							    currentId = i;
							}
						}
            
                        nMouseValue = anNbValue[kk];
            
            // position of the informations, in function of the window size
                        if (window.innerHeight) nPixLimitBottom = window.innerHeight;
                        else if (document.body && document.body.clientHeight) nPixLimitBottom = document.body.clientHeight;
                        else nPixLimitBottom = 500;
            
            // Informations at bottom
                        oDivInfo = document.getElementById("divInfo");
                        oDivInfo.style.top = nPixLimitBottom + cteInfoDeltaY;
                        DisplayInfo();
            
                        odivTime = document.getElementById("divTime");
                        odivTime .style.top = nPixLimitBottom + cteInfoDeltaY;
            
            // Move numbers every '100' millisecondes.
                        if (nTimerID == 0) nTimerID = setInterval("myWrite()", 100);
            
                        var oDivTerm = document.getElementById("divEnd");
                        oDivTerm.innerHTML = "";
            
                        var oDivCom = document.getElementById("divCommentaires");
                        oDivCom.innerHTML = "";
            
                    } // Start
            
                    function SetOption(strOption) {
            //=============================
            // Options to be tested
                        if (strOption == 'opt') {
                            // hide the button "options" while display other buttons
                            oDivOptions = document.getElementById("divOptionsShow");
                            oDivOptions.style.visibility = "hidden";
            
                            oDivOptions = document.getElementById("divOptions");
                            oDivOptions.style.visibility = "visible";
            
                            Termine();
                            return;
                        }
                        else {
                            // show the "option" button and hide other buttons.
                            oDivOptions = document.getElementById("divOptionsShow");
                            oDivOptions.style.visibility = "visible";
            
                            oDivOptions = document.getElementById("divOptions");
                            oDivOptions.style.visibility = "hidden";
                        }
            
            
            // choose the importance of error.
                        if (document.MaForm1.ErrorImportance.selectedIndex == 0) {nOptErr = 0; }
                        if (document.MaForm1.ErrorImportance.selectedIndex == 1) {nOptErr = 1; }
                        if (document.MaForm1.ErrorImportance.selectedIndex == 2) {nOptErr = 2; }
            //alert('Opt= ' + nOptErr + '   ' + nOptErr2 + '   ' +document.MaForm1.ErrorImportance.selectedIndex);
                        Start();
                    } // SetOption

            
                    // Initialisation
                    //=============================
                    if (document.addEventListener) { // Netscape 6+  &  Opera
                        document.addEventListener('mousemove', Mouse_follow, true);
                        document.addEventListener('click', Click_action, true);
                        document.addEventListener("mousedown",myRightMouseDown,false); // For opera
                        document.addEventListener("contextmenu", myContextMenu, false);
                    }
                    else { // IE
                        document.onmousemove = Mouse_follow;
                        document.onclick = Click_action;
                        document.oncontextmenu = myContextMenu;  // Works Well
                    }