//set up canvas


/*
	Basic terminal
	- need to add text scrolling at bottom of screen
	  o would also be nice to add history that I can scroll up through using up/down arrows and  maybe page up/down
	- would even be nice to add arrows for moving back and forth on line? (no)
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

//Set these to configure how editor works
var xOffSet = 8;       			//Off set to take into account canvases position on webpage
var fontSize = 26;  			//Font size
var lineHeight = fontSize;  	//Line height. Set to equal font right now. for more padding, you can increase this
var fontType = "monospace";     //font type. Must use a monospace font or cursor will not track correctly!
var prompt = ">>";             	//Sets the prompt text 

//More variables. Do not change!
var body = document.querySelector('body');
var terminal = document.getElementById('terminal');
var canvas = document.getElementById('canvas');

var keyBuffer = [prompt];
var text = prompt;
var ctx = canvas.getContext("2d");

var cursorX = 0,
	cursorY = 0;

var displayArea;

canvasInit();  //Initialize the canvas

//Backspace listener that deletes current text
//  This has to be added her to prevent the browser default from activating backpage
body.addEventListener('keydown', function(key){
	if(key.which == 8) {
		key.preventDefault();

		//only delete a character if we are not at the prompt
		if(text.length > prompt.length){
			text = text.slice(0, -1);
			keyBuffer[keyBuffer.length - 1] = text;
			drawText(keyBuffer, displayArea);			
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
	drawText(keyBuffer, displayArea);
	//console.log(keyBuffer);
	
});

body.addEventListener('click', function(mouse){
	//console.log(mouse.pageX);
});



//initalize the canvas
function canvasInit(){
	canvas.width = 1200;
	canvas.height = 800;
	displayArea = {x:0, y:0, width:canvas.width, height:canvas.height, background:'green'};  //Just a temporary display area for terminal drawText function

	ctx.fillStyle = 'green';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawText(keyBuffer, displayArea);
	//window.requestAnimationFrame(drawCursor);
}

//draw text
/* 
	Going to change this function so that it
	   1. takes an object that describes a rectangular area to display the text
	   2. object is as follows {x: value, y: value, width: value, height: value}
	   3. If text goes outside the bounds of the display area height (only track that for now)
	      then alter the text array by shifting out number of elements over verticale lines
	   4. could move regular line wraping (without enter) to the draw function?
	        - also, we don't want to send a line as a command untill enter is hit   

*/
function drawText(text, displayArea){
	/* Paramaters: 
	        - text = array of lines to display
	        - displayArea = object that defines displayArea {x:value, y:value, width:value, height:value, background:value}
	   Outputs: refreshes displayArea and draws text to area with proper line wraping and scrolling to fit     
	*/

	var x = displayArea.x,
		y = displayArea.y,
		width = displayArea.width,
		height = displayArea.height,
		background = displayArea.background;

	var displayMaxLines = Math.floor(height / lineHeight);	

	//Redraw canvas background to erase current text and images	
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//Set font size, type, and color
	ctx.font = fontSize + "px " + fontType;
	ctx.fillStyle = 'black';

	//Fit text to display height
	if(text.length > displayMaxLines){
		var overCount = text.length - displayMaxLines;
		for(var c = 0; c < overCount; c++){
			text.shift(); //shifts first lines out as text overflows display area
		}
	}

	//Draw contents of keyBuffer onto canvas
	for(var i = 0; i <= text.length-1; i++) {
		ctx.fillText(text[i], 0, lineHeight * (i + 1));
	}

	//Draw the cursor
	drawCursor(text);
}


//Draw cursor at end of line -
	// 1. calculate x position based on length of last keyBuffer line * font size?
	// 2. calculate y position based on length of keyBuffer (i.e. number of lines) * line height
function drawCursor(keyBuffer){
	cursorX = ((keyBuffer[keyBuffer.length - 1].length + 1) * (fontSize * 0.55)) - (xOffSet);
	cursorY  = ((keyBuffer.length-1) * lineHeight) + (lineHeight);
	ctx.fillStyle = 'white';
	ctx.fillRect(cursorX, cursorY, fontSize * 0.55, 2);	
}
	


