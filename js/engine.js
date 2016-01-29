function domLoad() {
	document.addEventListener("DOMContentLoaded", function() {
		document.getElementById("startButton").addEventListener("click", gameStart(), false);
});
}



function gameStart() {

    console.log("Game on!");
}