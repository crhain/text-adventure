//set up canvas


/*
	Basic terminal
	- Need to add word wrap so that words don't get split
	- Need to add backspace and delete
	- need to add text scrolling at bottom of screen
	  o would also be nice to add history that I can scroll up through using up/down arrows and  maybe page up/down
	- would even be nice to add arrows for moving back and forth on line?
	- also need to disable space, backspace, etc. from affecting browser window

	Game interface
	- divide terminal into display window and input window
	- may also add in capability to change configuration based on scene
	   1. full screen display
	   2. display with cursor and selections
	   3. speech display window with portraits of current speaker, option selection window in bottom and speech display in top
	   4. cutscene screen to display graphics
	   5. posibly add in some ui elements


	Polish/Animations/Effects
	- possibly add blinking cursor  
	- add text wavering effect
	- add monochromatic effect
    - add some other effect filters

    Responsivness
    - can resize browser window, which resizes html canvas
    - as canvas shrinks, font-size shrinks and text is redistirbuted to fit
	  
*/

var xOffSet = 8;
var lineHeight = 26;
var fontSize = 26;  //26

var body = document.querySelector('body');
var terminal = document.getElementById('terminal');
var canvas = document.getElementById('canvas');
var prompt = ">>";
var keyBuffer = [prompt];
var text = prompt;
var ctx = canvas.getContext("2d");

var cursorX = 0,
	cursorY = 0;

canvasInit();

//Backspace listener that deletes current text
//  This has to be added her to prevent the browser default from activating backpage
body.addEventListener('keydown', function(key){
	if(key.which == 8) {
		key.preventDefault();

		//only delete a character if we are not at the prompt
		if(text.length > prompt.length){
			text = text.slice(0, -1);
			keyBuffer[keyBuffer.length - 1] = text;
			drawText(keyBuffer);			
		}
		
	}
		 
});

//set up key capture event
body.addEventListener('keypress', function(key){
	//Declare some basic variables
	var charSize = fontSize * 0.55;
	var margin = 2;
	var lineCharLength = Math.round(canvas.width / charSize - margin);
	var pos = lineCharLength;
	var temp;
	//Decalre some utility functions
	var addNewLine = function(){
		keyBuffer[keyBuffer.length - 1] = text;
		keyBuffer.push(temp);
	}

	//implimentation of a line buffer to display multiple lines of text
	//Just need a word wrap function now
	
	//If any key other than backspace was pressed, add character to text of current line
	if(key.which != 8) {
		text += String.fromCharCode(key.which);

	}
	
	//If there is a carraige return, create a new line
	if(key.which == 13){  
		pos = text.length - 1;
		//slice current line up to break and after, storing stuff after on next line and rest in buffer
		temp = prompt;
		text = text.slice(0, pos);
		addNewLine();
		text = prompt;
		//!!!!!!need to add code that sends line to command interpreter
		
	}
	//If text reaches end of line, make a new line (note: but maybe not a forced carriage return?)
	else if(text.length > lineCharLength) {
		//get break position
		pos = lineCharLength + 1;
		//test for break on word and if so, then reset position to space before word
		if(text[pos-1] != " "){
			pos = text.lastIndexOf(" ") + 1;
			if(pos == 0)
				pos = lineCharLength;
		}
		//slice current line up to break and after, storing stuff after on next line and rest in buffer
		temp = prompt + text.slice(pos);
		text = text.slice(0, pos);
		addNewLine();
		text = temp;
	}
	//Add text to end of keybuffer
	else{
		//console.log("This should not create new lines!");
		keyBuffer[keyBuffer.length - 1] = text;	
	}

	//Rewdraw console text				
	drawText(keyBuffer);
	//console.log(keyBuffer);
	
});

body.addEventListener('click', function(mouse){
	//console.log(mouse.pageX);
});



//initalize the canvas
function canvasInit(){
	canvas.width = 1200;
	canvas.height = 800;

	ctx.fillStyle = 'green';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//window.requestAnimationFrame(drawCursor);
}

//draw text
function drawText(keyBuffer){
		
		var fontType = "monospace";
		

		ctx.fillStyle = 'green';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.font = fontSize + "px " + fontType;
		ctx.fillStyle = 'black';

		for(var i = 0; i <= keyBuffer.length-1; i++) {
			ctx.fillText(keyBuffer[i], 0, lineHeight * (i + 1));
			//console.log("looping:", i);	
		}


		//console.log(keyBuffer[keyBuffer.length - 1].length);

		cursorX = ((keyBuffer[keyBuffer.length - 1].length + 1) * (fontSize * 0.55)) - (xOffSet);
		//cursorY = (((keyBuffer.length-1) * lineHeight) + (lineHeight/2)) + 2;
		cursorY  = ((keyBuffer.length-1) * lineHeight) + (lineHeight);
		//console.log(cursorX, cursorY);
		ctx.fillStyle = 'white';
		ctx.fillRect(cursorX, cursorY, fontSize * 0.55, 2);

		/*Draw cursor at end of line -
		   1. calculate x position based on length of last keyBuffer line * font size?
		   2. calculate y position based on length of keyBuffer (i.e. number of lines) * line height
		*/
		
}

function drawCursor(){
	ctx.fillStyle = 'white';
	ctx.fillRect(0,30, 10, 10);
}

	


