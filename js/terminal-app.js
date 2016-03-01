
/* 
############################################################################################################################################################################################
############################################################################################################################################################################################

	To Do:
	 1. ctx.measureText(string)  ==> this will return the width in pixels of a string.  
	    Can use this to calculate line width for non-monospace fonts!!!!  Re-write using this instead of the hacked method I use
	 2. drawText method will display all lines in keyBuffer array, while making sure they fit the line. 
	    **** word wrap works except: if I type a word to edge of line and cursor goes to next line and then I hit a space, it will wrap the word instead of adding space to next line?!?!
	 3. My have to create seperate drawText methods for display and terminal because terminal gets it's data from keybuffer and display does not
	
	Terminal interface
	- add submitCommand method that takes the following paramaters (commandText, targetObj)  
	- text scrolling with up/down and/or pageup/pagedown
	- also need to disable space, backspace, etc. from affecting browser window
	
	Display interface

	- add ability to draw images

	Game interface
    
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
###############################################################################################################################################################################################	  
*/


//More variables. Do not change!
var body = document.querySelector('body');

//############################################################################
//CANVAS OBJECT DEFINITION
//============================================================================
function Canvas(width, height, tag) {
	this.canvas = document.getElementById(tag);	
	this.ctx = this.canvas.getContext("2d");

	//initialize canvas on creation
	this.canvas.width = width;
	this.canvas.height = height;
	this.ctx.fillStyle = 'green';
	this.ctx.fillRect(0, 0, this.width, this.height);
};



//############################################################################################################################################
//DISPLAY OBJECT CONSTRUCTOR FUNCTION
//============================================================================================================================================
//contains basic properties for displaying text
//--------------------------------------------------------------------------------------------------------------------------------------------

function Display(displayArea, font, canvas){
	this.canvas = canvas;
	this.display = displayArea;		//{x:pos, y:pos, width:number, height:number, background:color_string} object that defines display
	this.font = font;				//{color:string, size:integer, style:string} object that defines font
	this.text = "";					//represents the string of text to be displayed
	this.displayBuffer = [];        //holds formated text to be displayed - do not use directly. this is a hack so that Terminal.drawText can reference Display.drawText properly. should call this something else?
	this.formattedText = [];        //This is used by drawText function to format text lines.  It has to be sotred here so that other objects that
	                                //inherit but modify the drawText function


	/*
		keyboardBuffer = array of lines entered into the keyboard.  Each entry is created by a carriage return
		displayBuffer = array of lines pushed to the display.  engine just has to call the drawFunction with the displayBuffer as an argument.
		                   display buffer could be saved on the display object or in the engine.  I think it is better keeping it on the display.
		                   so to write to it, the engine has to first push text into the display buffer and then send a reference to it in the drawfucntion.
		                   but we could also set up the drawText to read its own display buffer if nothing is sent to it.
		formattedLines = array used by drawText function to format the lines of text displayed. This could be declared by the drawText function each time it is run.
		                 it also has to empty it each time so that it doesn't get duplicate lines filed.  I suppose I could do a comparison to see if lines are already in and only push new lines?
	*/

	/*
	var charSize = terminal.font.size * 0.55;
	var margin = 2;

	var heightInLines = Math.floor(height / lineHeight);	
	var widthInChars = Math.round(width / charSize - margin);
	*/
}

//-----------------------------------------------------------------------------------------------
//DISPLAY: init method
//-----------------------------------------------------------------------------------------------
//sets up some key variables on the display: these cannot be declared in the contructor
//Inputs: 
//			None
//
//	Outputs:
//			None
//------------------------------------------------------------------------------------------------
Display.prototype.init = function(){
	var charSize = this.font.size * 0.55;
	var margin = 2;
	this.widthInChars = Math.round((this.display.width - this.display.x) / charSize - margin);            //var widthInChars
	this.heightInLines = Math.floor((this.display.height - this.display.y) / this.font.size);                 //var heightInLines
		
}


//-----------------------------------------------------------------------------------------------
//DISPLAY: drawText method
//-----------------------------------------------------------------------------------------------
//contains basic properties for displaying text
//Inputs: 
//			text = an array of text lines to be displayed
//
//	Outputs:
//			- draws on the canvas.  Currently looks at global variables to get canvas, but can be
//			updated so that it gets canvas context reference in arguments
//------------------------------------------------------------------------------------------------


Display.prototype.drawText = function(text){
	
	var formattedText = [];   //formattedText holds formmated lines of text
	var ctx = this.canvas.ctx;
	
	var x = this.display.x,
		y = this.display.y,
		width = this.display.width,
		height = this.display.height,
		background = this.display.background;
	var fontSize = this.font.size,
		fontColor = this.font.color,
		fontStyle = this.font.style;

	var lineHeight = fontSize;

	var charSize = terminal.font.size * 0.55;
	var margin = 2;

	//Have to declare these here because these will set themselves properly when calling through terminal draw function!
	//var heightInLines = Math.floor(height - y / fontSize);	
	//var widthInChars = Math.round(width - x / charSize - margin);

	var widthInChars = Math.round((this.display.width - this.display.x) / charSize - margin);            //var widthInChars
	var widthInPixels = this.display.width                                                               //if we add in margins, these will have to be figured in.
	var heightInLines = Math.floor((this.display.height - this.display.y) / this.font.size);                 //var heightInLines

	//console.log("Line Height is:", heightInLines);

	//console.log("height=", heightInLines);
	//console.log("width=", widthInChars);

	//Referesh the background color
	refreshBackground();

	//Refersh background image (or images?) if there are any
	refreshImage();

	//!!!! Last array entery could be longer than a line or more
	//     So it needs to be broken up.
	//     best to create a temporary array for displaying	
	var pos,
		excess,
		currentLineText,
		newLineText;
	//console.log("SCREEN LINE SIZE:", widthInChars);	

	//Format the contents of text and add to formattedText


	//console.log("The line is", this.canvas.ctx.measureText(text[0]).width, "pixels wide");

	/*
		1. I want to go through each line of text
		2. Then I want to get it's actual text width in pixels and see if it is less than or = to the actuall display width
		3. If it is, then I need to break that line into segments and push those to the formattedText array and apply word wrao
	*/



	text.forEach(function(currentLineText, index, text){
		var lineWidthInPixels = ctx.measureText(currentLineText).width;
		var pos = 0;
		if(lineWidthInPixels <= width){  //If the line width is less or equal to the displays width
			formattedText.push(currentLineText);	//push the current line into formattedText array
		}
		else{
			//var currentLineLength = currentLineText.length;
			var testIndex = 0;
			while(currentLineText.length > 0 && testIndex < 1000){
				testIndex++;
				console.log("line slicing", testIndex, "times");
				lineWidthInPixels = ctx.measureText(currentLineText).width;
				if(lineWidthInPixels <= width){
					console.log('adding full line! pixel width:', lineWidthInPixels, "display:", width/(fontSize*.55));
					newLineText = currentLineText;
					currentLineText = "";	
				}
				else{  //Need to modify this code
					//before, we could just chop it up by number of characters, but now we have to test each segment
					//to see if it fits by pixels.  Could figure out average pixel length for font-size and start there.
					//if it is too small, add additional characters until it is equal or if too big, subtract characters.
					pos = getSliceIndex(currentLineText);
					console.log("My current slice position is:", pos);
					newLineText = currentLineText.slice(0, pos);
					currentLineText = currentLineText.slice(pos);
					console.log("My new text line is:", newLineText);
					console.log("My old text line is:", currentLineText);
					//wordWrapOffset = getWordWrapOffset(currentLineText.slice(0, widthInChars), widthInChars);
					//newLineText = currentLineText.slice(0, widthInChars - (wordWrapOffset));
					//currentLineText = currentLineText.slice(widthInChars - (wordWrapOffset));  //Set currentLineText to remainder of line
				}

				formattedText.push(newLineText);		
				this.formattedText = formattedText;	
			}
		}

	});

		
	//Fit text to display height
	if(formattedText.length > heightInLines){
		var overCount = formattedText.length - heightInLines;
		for(var c = 0; c < overCount; c++){
			formattedText.shift(); //shifts first lines out as text overflows display area
		}
	}

	
	//Draw contents of keyBuffer onto canvas
	for(var i = 0; i <= formattedText.length-1; i++) {
	
		this.canvas.ctx.fillText(formattedText[i], x, y + (lineHeight * (i + 1)));		
	}	

	//set objects displayBuffer to formattedText so that it can be accessed outside object
	this.formattedText = formattedText;

	function refreshBackground(){
		this.canvas.ctx.fillStyle = background;
		this.canvas.ctx.fillRect(x, y, width, height);

		//Set font size, type, and color
		this.canvas.ctx.font = fontSize + "px " + fontStyle;
		this.canvas.ctx.fillStyle = fontColor;	
	}

	function refreshImage(){

	}

	//returns a tuple with new line and old line
	function getSliceIndex(line){
		for (var i = line.length - 1; i > 0; i--){
			newLine = line.slice(0, i);
			if (ctx.measureText(newLine).width <= width)
				return i;
		}
		
		return null;  //error!

	}

	function getWordWrapOffset(line, widthInPixels){
			//test for break on word and if so, then reset position to space before word
			var offSet = 0;
			if(line[widthInPixels-1] != " "){
				var spacePos = line.lastIndexOf(" ");
				//console.log("SPACE POS=", spacePos);
				if(spacePos == -1)
					return offSet;
				offSet = (widthInChars - spacePos) - 1;				
			}

			//console.log("WORD OFFSET=", offSet);
			return offSet;
	}

}
	


//############################################################################################################################################
//TERMINAL OBJECT CONSTRUCTOR FUNCTION
//============================================================================================================================================
//The terminal displays command input and sends it to the game engine when it is entered
//		It will also temporarily hold display output untill we create a display window object
//--------------------------------------------------------------------------------------------------------------------------------------------
function Terminal(displayArea, font, canvas){

    Display.call(this, displayArea, font, canvas);
    //Inherits the folowing properties from Display:
    	//this.display
    	//this.font
	this.prompt = ">>";        				//Style of prompt - defined within constructor for now
	this.keyBuffer = [this.prompt];   		//holds lines of text entered by keystroke, creating new entries in the array for carriage returns
	this.commandLine;         				//holds text for each command. Whenever enter is hit, the last line in keyBuffer is assigned to this

}

//Set up Terminal object constructor to inheriet methods from Display
Terminal.prototype = Object.create(Display.prototype); 
Terminal.prototype.constructor = Terminal;  //gives it correct constructor method


//-----------------------------------------------------------------------------------------------
//TERMINAL: init method
//-----------------------------------------------------------------------------------------------
//Sets up event listeners to capture keystrokes and call drawText method to draw them.
//Inputs: 
//			None
//
//	Outputs:
//			None
//------------------------------------------------------------------------------------------------
Terminal.prototype.init = function(){
	self = this;  //to create a reference to the terminal and not to the item calling the event listener
	
	prompt = self.prompt;       //text for prompt
	var text = prompt;  //this is a temporary string to hold key inputs in listeners

	var charSize = this.font.size * 0.55;
	var margin = 2;
	this.widthInChars = Math.round((this.display.width - this.display.x) / charSize - margin);            //var widthInChars
	this.heightInLines = Math.floor((this.display.height - this.display.y) / this.font.size);                 //var heightInLines


	//console.log("initializing terminal!", self.keyBuffer);


	//Add basic key listener event
	document.addEventListener('keypress', function(key){
		//Declare some basic variables
		//console.log('hitting the keys');
		var widthInChars = self.widthInChars;
		var pos = widthInChars;
		var temp;


		//Decalre some utility functions
		var addNewLine = function(){
			self.commandLine = text;
			//need to send the commandLine to the engine now
			self.keyBuffer[self.keyBuffer.length - 1] = text;
			self.keyBuffer.push(temp);
			//console.log("sending command:", terminal.commandLine);
			//console.log("sending command:", self.commandLine);
			
		}

		
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
		//Add text to end of self.keyBuffer
		else{
			//console.log("This should not create new lines!");
			self.keyBuffer[self.keyBuffer.length - 1] = text;	
		}

		//Rewdraw console text				
		self.drawText(self.keyBuffer);
		
		
	} );

	//Add evend listener to capture backspace and prevent default browser action
	document.addEventListener('keydown', function(key){
		if(key.which == 8) {
			key.preventDefault();

			//only delete a character if we are not at the prompt
			if(text.length > prompt.length){
				text = text.slice(0, -1);
				self.keyBuffer[self.keyBuffer.length - 1] = text;
				self.drawText(self.keyBuffer);			
			}		
		}		 
	});	


} 


//-----------------------------------------------------------------------------------------------
//TTERMINAL: drawText method
//-----------------------------------------------------------------------------------------------
//Based on: Display.drawText method, adds cursor after text
//Inputs: 
//			None
//
//	Outputs:
//			None
//------------------------------------------------------------------------------------------------
Terminal.prototype.drawText = function(text){

	//This fancy line is calling the original drawText function defined on Display - but it does not give this function access
	// to it's variables, so we need to make variables we need public properties on the ojbect :(
	Object.getPrototypeOf(new Display(this.display, this.font, this.canvas)).drawText.call(this, text);

	//This public property holds the formatted text array used in Display.drawText
	var ctx = this.canvas.ctx,
		fontSize = this.font.size,
		lineHeight = fontSize,
		formattedText = this.formattedText,
		heightInLines = (formattedText.length) * fontSize,
		widthInPixels = this.display.width,  
		x = this.display.x,
		y = this.display.y;
		//console.log("x:", x);
		//console.log("y:", y);
	//DRAW THE CURSOR OBJECT
	//var cursorX = x + ((formattedText[formattedText.length - 1].length + 1) * (fontSize * 0.55)) - (fontSize * 0.55);  //!!!!change once we have new formating
	
	var cursorX = x + ctx.measureText(formattedText[formattedText.length - 1]).width; 
	var cursorY  = y + heightInLines + (lineHeight * 0.20); //+ (lineHeight);
	if(formattedText[formattedText.length -1].length >= this.widthInPixels) {
		cursorY += lineHeight;
		cursorX = x;
	}
		

	ctx.fillStyle = 'black';
	ctx.fillRect(cursorX, cursorY, fontSize * 0.55, 2);	
	
}


/* #####################################################################################################################################################
   ############################               MAIN SECTION OF TERMINAL-APP : 
   #####################################################################################################################################################	
*/

//create a new canvas
// this is required to initialize the other objects as they must take it as a paramater
var canvas = new Canvas(1200, 600, 'canvas');


//Creates terminal object for inputing text and displaying the text input
var terminal = new Terminal(
	{
		x:0,   //sets x position where terminal display starts
		y:400,   //sets y position where terminal display starts
		width:canvas.canvas.width - 2,    //sets how wide the terminal display is
		height:canvas.canvas.height - 2,  //sets how far down the terminal display goes
		background:'#517F51'              //sets background color: can give word, rgb string, or hex
	},
	{
		color:'black',                   //sets font color
		size: 20,                        //sets font size
		style: 'monospace'               //sets font type (!!!kep it a monospace font type or cursor may not track so well)
	},
	canvas                               //reference to canvas object that the terminal appears on.
);


//Start Terminal & draw initial text
terminal.init();
terminal.drawText(terminal.keyBuffer);


var display = new Display(
	{
		x:0,
		y:0,
		width:canvas.canvas.width - 2,
		height:canvas.canvas.height - 200,
		background: 'black'
	},
	{
		color:'white',
		size: 36,
		style: 'cursive'
	},
	canvas

);

display.init();
display.drawText(["THE DISPLAY ;-)"]);


/*
	In addition to different panes and text display, I may also want to draw the following
	1. UI. Elements
	2. 
	
*/

