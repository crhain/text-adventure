
/* 
############################################################################################################################################################################################
############################################################################################################################################################################################

	To Do:
	 2. drawText method will display all lines in keyBuffer array, while making sure they fit the line. 
	    **** word wrap works except: if I type a word to edge of line and cursor goes to next line and then I hit a space, it will wrap the word instead of adding space to next line?!?!
	
	Basic terminal
	
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
	this.displayBuffer = [];        //holds formated text to be displayed - do not use directly. this is a hack so that Terminal.drawText can reference Display.drawText properly

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
	this.widthInChars = Math.round(this.display.width / charSize - margin);            //var widthInChars
	this.heightInLines = Math.floor(this.display.height / this.font.size);                 //var heightInLines
		
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
	
	var displayText = [];   //displayText holds formmated lines of text

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
	var heightInLines = Math.floor(height / fontSize);	
	var widthInChars = Math.round(width / charSize - margin);

	//console.log("height=", heightInLines);
	//console.log("width=", widthInChars);
	//Redraw canvas background to erase current text and images	
	this.canvas.ctx.fillStyle = background;
	this.canvas.ctx.fillRect(x, y, width, height);

	//Set font size, type, and color
	this.canvas.ctx.font = fontSize + "px " + fontStyle;
	this.canvas.ctx.fillStyle = fontColor;

	//!!!! Last array entery could be longer than a line or more
	//     So it needs to be broken up.
	//     best to create a temporary array for displaying	
	var pos,
		excess,
		currentLineText,
		newLineText;
	//console.log("SCREEN LINE SIZE:", widthInChars);	

	//Format the contents of text and add to displayText
	for(var n=0; n < text.length; n++){
		//displayText.push(text[i]);
		currentLineText = text[n];

		if(currentLineText.length <= widthInChars){  //This adds all lines that were created either with carriage returns or which are less than or equal to line length
			//console.log("ADD REGULAR: index:", n, "length:", currentLineText.length);
			displayText.push(currentLineText);
		}
		else{   //This will parce any line that is longer than the line length
			
			var currentLineLength = currentLineText.length;
		
		
			while(currentLineText.length > 0)	{
				//if the currentLineLength is less than a full line, then just add it
				if(currentLineText.length <= widthInChars){
					newLineText = currentLineText;
					currentLineText = "";
				}
				else{ //It is greater than the line character line, so it must be sniped
					wordWrapOffset = getWordWrapOffset(currentLineText.slice(0, widthInChars), widthInChars);
					newLineText = currentLineText.slice(0, widthInChars - (wordWrapOffset));
					currentLineText = currentLineText.slice(widthInChars - (wordWrapOffset));  //Set currentLineText to remainder of line
				}
	
				//console.log("ADD FULL OVERFLOW: index:", n+nl, "length:", newLineText.length);;  //This code never gets fired
				//console.log("---Adding:", newLineText);
				displayText.push(newLineText);		
				this.displayBuffer = displayText;	
			}

		} 
	}	


	//Fit text to display height
	if(displayText.length > heightInLines){
		var overCount = displayText.length - heightInLines;
		for(var c = 0; c < overCount; c++){
			displayText.shift(); //shifts first lines out as text overflows display area
		}
	}

	
	//Draw contents of keyBuffer onto canvas
	for(var i = 0; i <= displayText.length-1; i++) {
	
		this.canvas.ctx.fillText(displayText[i], 0, lineHeight * (i + 1));		
	}	

	//set objects displayBuffer to displayText so that it can be accessed outside object
	this.displayBuffer = displayText;

		
	function getWordWrapOffset(line, widthInChars){
			//test for break on word and if so, then reset position to space before word
			var offSet = 0;
			if(line[widthInChars-1] != " "){
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
	this.widthInChars = Math.round(this.display.width / charSize - margin);            //var widthInChars
	this.heightInLines = Math.floor(this.display.height / this.font.size);                 //var heightInLines


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
	var displayText = this.displayBuffer;

	
	var fontSize = this.font.size,
		lineHeight = fontSize;

	//DRAW THE CURSOR OBJECT
	var cursorX = ((displayText[displayText.length - 1].length + 1) * (fontSize * 0.55)) - (fontSize * 0.55);
	var cursorY  = ((displayText.length) * lineHeight) + (lineHeight * 0.20); //+ (lineHeight);
	if(displayText[displayText.length -1].length >= this.widthInChars) {
		cursorY += lineHeight;
		cursorX = 0;
	}
		

	this.canvas.ctx.fillStyle = 'white';
	this.canvas.ctx.fillRect(cursorX, cursorY, fontSize * 0.55, 2);	

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
		x:0,
		y:0,
		width:canvas.canvas.width - 2,
		height:canvas.canvas.height - 2,
		background:'#517F51'
	},
	{
		color:'black',
		size: 20,
		style: 'monospace'
	},
	canvas
);


//Start Terminal & draw initial text
terminal.init();
terminal.drawText(terminal.keyBuffer);



