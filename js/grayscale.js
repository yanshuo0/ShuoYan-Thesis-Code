// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});



// Define two global variables to store the data
            var data = [];
			// Define two global variables to store the data
	var gameData = 0;
	var dataLen = 0;
	var qWeight = 3;                                                // Times need to be answered for each question
	var timeWin = 0;
	var counter = 0;
	var QUESTION = 0;
	var ANSWER = 0;
	var currentId;
	var wrongNum = 0;


function getBoundary(element, start) {
    var property = start ? "selectionStart" : "selectionEnd";
    var originalValue, textInputRange, precedingRange, pos, bookmark, isAtEnd;

    if (typeof element[property] == "number") {
        return element[property];
    } else if (document.selection && document.selection.createRange) {
        element.focus();

        var range = document.selection.createRange();
        if (range) {
            // Collapse the selected range if the selection is not a caret
            if (document.selection.type == "Text") {
                range.collapse(!!start);
            }

            originalValue = element.value;
            textInputRange = element.createTextRange();
            precedingRange = element.createTextRange();
            pos = 0;

            bookmark = range.getBookmark();
            textInputRange.moveToBookmark(bookmark);

            if (/[\r\n]/.test(originalValue)) {
                // Trickier case where input value contains line breaks
                // Test whether the selection range is at the end of the
                // text input by moving it on by one character and
                // checking if it's still within the text input.
                try {
                    range.move("character", 1);
                    isAtEnd = (range.parentElement() != element);
                } catch (ex) {
                    log.warn("Error moving range", ex);
                    isAtEnd = true;
                }
                range.moveToBookmark(bookmark);

                if (isAtEnd) {
                    pos = originalValue.length;
                } else {
                    // Insert a character in the text input range and use
                    // that as a marker
                    textInputRange.text = " ";
                    precedingRange.setEndPoint("EndToStart", textInputRange);
                    pos = precedingRange.text.length - 1;

                    // Delete the inserted character
                    textInputRange.moveStart("character", -1);
                    textInputRange.text = "";
                }
            } else {
                // Easier case where input value contains no line breaks
                precedingRange.setEndPoint("EndToStart", textInputRange);
                pos = precedingRange.text.length;
            }
            return pos;
        }
    }
    return 0;
}

function getSelection(textarea) {
    var start = getBoundary(textarea, true),
        end = getBoundary(textarea, false);

    return {
        start: start,
        end: end,
        length: end - start,
        text: textarea.value.slice(start, end)
    };
}

function detectPaste(textarea, callback) {
    textarea.onpaste = function () {
        var sel = getSelection(textarea);
        var initialLength = textarea.value.length;
        window.setTimeout(function () {
            var val = textarea.value;
            var pastedTextLength = val.length - (initialLength - sel.length);
            var end = sel.start + pastedTextLength;
            callback({
                start: sel.start,
                end: end,
                length: pastedTextLength,
                text: val.slice(sel.start, end),
                replacedText: sel.text
            });
        }, 1);
    };
}


function userInput() {
    var textarea = document.getElementById("dataImporter");
    //detectPaste(textarea, function (pasteInfo) {
        var val = textarea.value;
	    val = val.replace(/(^\s*)|(\s*$)/gi,"");
	    val = val.replace(/[ ]{2,}/gi," ");
	    val = val.replace(/\n /,"\n");
        document.getElementById("dataImporter").value = val;

        var keyval = document.getElementById("dataImporter").value.split(/[\r\n]/);
        console.log(keyval);
        if (keyval == "") {
        	sweetAlert("Oops!", "No data imported", "error");
        } else {
        //console.log(typeof(keyval));
	    //keyval = keyval.replace(/(^\s*)|(\s*$)/gi,"");
	    //keyval = keyval.replace(/[ ]{2,}/gi," ");
	    //keyval = keyval.replace(/\n /,"\n");
	    //document.getElementById("textString").value = s;


        //console.log(keyval);
        
        //document.getElementById("save").onclick=function (e)
    //{
        //if (!(/\d/.test(keyval))) {
            for (var index = 0; index < keyval.length; index++) {
                var temp = keyval[index].split('=');
                //console.log(temp[0].trim());
                //console.log(temp[1].trim());
                //console.log(typeof(temp));
                data.push({"key": temp[0].trim(), "value": temp[1].trim()});
            }
            //console.log(data);

            sessionStorage.setItem('myData', JSON.stringify(data));
			sweetAlert("Congrats!", "Your data has been saved!", "success");
		}
   
}
document.getElementById("save").addEventListener("click", userInput, false);


	
	
function resetImporter() {
    document.getElementById("dataImporter").value = "";
    sessionStorage.clear();
    gameData = 0;
    //alert("Imported data has been removed!");
}

document.getElementById("clear").addEventListener("click", resetImporter, false);

function showInstruction() {
    $("#instruction").modal('show');
}
document.getElementById("instruct").addEventListener("click", showInstruction, false);

