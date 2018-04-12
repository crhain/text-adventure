
/* 
############################################################################################################################################################################################
############################################################################################################################################################################################

	To Do:
	    - add marginTop, marginBottom, marginRight, and marginLeft  or maybe just a margin object and use that to determine text placement
	    - allow for border around canvas (color, thickness); display area will automatically adjust for this border
	    - allow for lines at borders on display elements. 
	    - add methods to display to resize it, draw it, and hide it
		- if a block of text passed to drawText is bigger than can fit on screen (i.e. more lines than screen lines), then more is inserted and player must press <enter> to continue

	Revision: 
			I will probably need to remove line breaking for non-carriage returned lines from terminal or at least limit continuous lines involved
			I will have to format keybuffer and push to display buffer for display similar to the way I am doing it for display
	
	
	Terminal interface (bonus items)
	- text scrolling with up/down and/or pageup/pagedown
	- also need to disable space, backspace, etc. from affecting browser window
	
	Display interface (bonus items)
	- add ability to format text.. for instance, different color text, font types, and sizes
	    o add tags for font-weight, color, line break, and possibly alignment; these are similar to html tags
	    o parced and formated text will go into an array as follows:
	    [
			"just some regular text",
			[["some"],[{color: 'blue'}, "blue"], ["text, and some"], [{color: 'red'}, "red"], ["text"]]
			"just another regular line.",

	    ];
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
export const Canvas = function (width, height, tag) {
	this.canvas = document.getElementById(tag);	
	this.ctx = this.canvas.getContext("2d");

	//initialize canvas on creation
	//this.canvas.width = width;
	//this.canvas.height = height;
	this.ctx.fillStyle = 'green';
	this.ctx.fillRect(0, 0, this.width, this.height);
};



//############################################################################################################################################
//DISPLAY OBJECT CONSTRUCTOR FUNCTION
//============================================================================================================================================
//contains basic properties for displaying text
//--------------------------------------------------------------------------------------------------------------------------------------------

export const Display = function (displayArea, font, canvas){
	this.canvas = canvas;
	this.display = displayArea;		//{x:pos, y:pos, width:number, height:number, background:color_string} object that defines display
	this.font = font;				//{color:string, size:integer, style:string} object that defines font
	this.text = "";					//represents the string of text to be displayed
	this.displayBuffer = [];        //holds formated text to be displayed - do not use directly. this is a hack so that Terminal.drawText can reference Display.drawText properly. should call this something else?
	//this.formattedText = [];        //This is used by drawText function to format text lines.  It has to be sotred here so that other objects that
	                                //inherit but modify the drawText function
	this.refreshBackground();

	/*
		keyboardBuffer = array of lines entered into the keyboard.  Each entry is created by a carriage return
		displayBuffer = array of lines pushed to the display.  engine just has to call the drawFunction with the displayBuffer as an argument.
		                   display buffer could be saved on the display object or in the engine.  I think it is better keeping it on the display.
		                   so to write to it, the engine has to first push text into the display buffer and then send a reference to it in the drawfucntion.
		                   but we could also set up the drawText to read its own display buffer if nothing is sent to it.
		formattedLines = array used by drawText function to format the lines of text displayed. This could be declared by the drawText function each time it is run.
		                 it also has to empty it each time so that it doesn't get duplicate lines filed.  I suppose I could do a comparison to see if lines are already in and only push new lines?
	*/

}

Display.prototype = Object.create(Object.prototype); 
//Terminal.prototype.constructor = Terminal;  //gives it correct constructor method

//################################################################################################
//PUBLIC DISPLAY METHODS
//################################################################################################

//-----------------------------------------------------------------------------------------------
//DISPLAY: init method
//-----------------------------------------------------------------------------------------------
//sets up some key variables on the display: these cannot be declared in the contructor
//Inputs: 
//			None
//	Outputs:
//			None
//------------------------------------------------------------------------------------------------
Display.prototype.init = function(){
	//this.refreshBackground();		
}

//-----------------------------------------------------------------------------------------------
//DISPLAY: clear method
//-----------------------------------------------------------------------------------------------
//clears displayBuffer and display
//Inputs: 
//			None
//
//	Outputs:
//			- clears diplay and displayBuffer
//------------------------------------------------------------------------------------------------
Display.prototype.clear = function(){
	this.displayBuffer = []; //empty displayBuffer
	this.refreshBackground(); //refresh background
}

//-----------------------------------------------------------------------------------------------
//DISPLAY: showText method
//-----------------------------------------------------------------------------------------------
//wraper for drawText, formatText, setFont and addTextToDisplay buffer (non of whcih should be
//      called sperately)
//Inputs: 
//			text = an array of text lines to be displayed
//          nopad = true/false to not add line break before text; defaults to false if not set
//
//	Outputs:
//			- outputs formated text to the display and adds it to display buffer
//	
//------------------------------------------------------------------------------------------------
Display.prototype.showText = function(text, nopad){
	
	if(this.displayBuffer.length > 0){ //if there is something in the display buffer 
		//console.log(displayBuffer);
		if(!nopad) this.addTextToDisplayBuffer([""]); //if nopad set to false then add pad
	}  
		

	//set font so that format text works
	this.setFont();
	
	var formattedText = this.formatText(text);
	this.addTextToDisplayBuffer(formattedText);

	this.drawText(this.displayBuffer);
}
//################################################################################################################
//PRIVATE DISPLAY METHODS
//################################################################################################################

//draw/refresh the background
Display.prototype.refreshBackground = function(){
		
		this.canvas.ctx.fillStyle = this.display.background;
		this.canvas.ctx.fillRect(this.display.x, this.display.y, this.display.width, this.display.height);

		//this.canvas.ctx.strokeStyle = 'orange';
		//this.canvas.ctx.lineWidth = 8
		//this.canvas.ctx.strokeRect(this.display.x-3, this.display.y-3, this.display.width+3, this.display.height+3);

	
}

//set the current font on the canvas
Display.prototype.setFont = function(font){
	if(font === undefined)
		font = this.font;

	var fontSize = font.size;
	var fontColor = font.color;
	var fontStyle = font.style;

	this.canvas.ctx.font = fontSize + "px " + fontStyle;
	this.canvas.ctx.fillStyle = fontColor;	

}


//Pushes text array to display buffer
Display.prototype.addTextToDisplayBuffer = function(text){
	
	if(typeof(text) === 'string')
		text = [text];

	var self = this;

	text.forEach(function(currentLine, index){
		self.displayBuffer.push(currentLine);
	});
}


Display.prototype.formatText = function(text){

	if(typeof(text) === 'string')
		text = [text];

	
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

	//var charSize = terminal.font.size * 0.55;
	//var charSize = terminal.font.size * 0.25; //I am only
	var margin = 2;

	//Have to declare these here because these will set themselves properly when calling through terminal draw function!
	//var heightInLines = Math.floor(height - y / fontSize);	
	//var widthInChars = Math.round(width - x / charSize - margin);

	//This is now only being used to estimate how many characters fit in a line.  It is set so that it is large enough so that it will be larger than line.
	//This helps the line fitting alogrithim to be more efficent since it only has to trim down a smaller line instead of the entier text line.
	var widthInChars = Math.round((this.display.width - this.display.x) / (fontSize * 0.12) );
	var widthInPixels = this.display.width                                                               //if we add in margins, these will have to be figured in.
	var heightInLines = Math.floor((this.display.height - this.display.y) / fontSize);                 //var heightInLines

	
	var	newLineText;
	//console.log("SCREEN LINE SIZE:", widthInChars);	

	//Format the contents of text and add to formattedText
	//console.log("my font size is:", fontSize);

	//console.log("The line is", this.canvas.ctx.measureText(text[0]).width, "pixels wide");

	/*
		1. I want to go through each line of text
		2. Then I want to get it's actual text width in pixels and see if it is less than or = to the actuall display width
		3. If it is, then I need to break that line into segments and push those to the formattedText array and apply word wrao
	*/

	
	text.forEach(function(currentLineText, index){
		var lineWidthInPixels = ctx.measureText(currentLineText).width;
		var pos = 0;
		if(lineWidthInPixels <= width){  //If the line width is less or equal to the displays width
			formattedText.push(currentLineText);	//push the current line into formattedText array
			//console.log("running formatText! width:", width, "pixels:", lineWidthInPixels, "text:", currentLineText);
		}
		else{
			//var currentLineLength = currentLineText.length;
			var testIndex = 0;
			while(currentLineText.length > 0){
				
				//console.log("line slicing", testIndex, "times");
				lineWidthInPixels = ctx.measureText(currentLineText).width;
				if(lineWidthInPixels <= width){

					//console.log('adding full line! pixel width:', lineWidthInPixels, "display:", width/(fontSize*.55));
					newLineText = currentLineText;
					currentLineText = "";	
				}
				else{ 
					//before, we could just chop it up by number of characters, but now we have to test each segment
					//to see if it fits by pixels.  Could figure out average pixel length for font-size and start there.
					//if it is too small, add additional characters until it is equal or if too big, subtract characters.
					pos = getSliceIndex(currentLineText, lineWidthInPixels);
					wordWrapOffset = getWordWrapOffset(currentLineText.slice(0, pos)); //This corresponds to the new line to be added
					newLineText = currentLineText.slice(0, pos - (wordWrapOffset));
					currentLineText = currentLineText.slice(pos - (wordWrapOffset));  //Set currentLineText to remainder of line
				}

				formattedText.push(newLineText);		
				//this.formattedText = formattedText;	
			}
		}
	});
	
		
	//the position to snip lines at... but it is really inefficent as the line gets longer :(
	// need a better alogrithim.  Maybe instead of searching backwards, I should either
	// 1. use a bisecting search
	// 2. estimate line length based on number of characters and some sort of average. and then refine
	function getSliceIndex(line){
		//take an experimental slice using widthInChars 

		var pos = null;

		//Take an experimental slice using widthInChars
		var newLine = line.slice(0, widthInChars);
		newLineSize = ctx.measureText(newLine).width;
		//console.log("getSliceIndex: newLine chars:", newLine.length, "newLine pixels:", newLineSize, "display pixels:", width);
		var i = newLine.length - 1;

		//Get the measure of that 
		if(newLineSize == width){  //return current new line length as index becuse it matches!
			//console.log("getSliceIndex =!!!!");
			pos = newLine.length - 1;
		}
		else if (newLineSize < width){  //newLineSize is less than width, so increment start from current position to end untill it matches
			//console.log("getSliceIndex <!!!!");
			for(i; i <= line.length - 1; i++){
				//console.log("getSlice <!!!! index:", i);
				newLine = line.slice(0, i);
				if(ctx.measureText(newLine).width <= width){
					pos = i;		
				}
			}

			return pos;
		}
		else{  //it is greater than so start at its current position and decrement untill it matches
			//console.log("getSliceIndex >!!!! pos:");
			for(i; i > 0; i--){
				newLine = line.slice(0, i);
				if(ctx.measureText(newLine).width <= width){
					pos = i;
					//console.log("readjusted size:", ctx.measureText(newLine).width);
					//console.log("adding:", newLine);
					return pos;
				}
			}
		}

		return pos;

	}

	function getWordWrapOffset(line){
			//test for break on word and if so, then reset position to space before word
			var offSet = 0;
			if(line[line.length-1] != " "){
				var spacePos = line.lastIndexOf(" ");
		
				if(spacePos == -1)
					return offSet;
				offSet = (line.length - spacePos) - 1;				
			}

			return offSet;
	}

	return formattedText;
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
	
	
	//var displayBuffer = this.displayBuffer

	var ctx = this.canvas.ctx;

	this.refreshBackground();
	this.setFont();
	
	var x = this.display.x,
		y = this.display.y,
		width = this.display.width,
		height = this.display.height,
		background = this.display.background;
	var fontSize = this.font.size,
		fontColor = this.font.color,
		fontStyle = this.font.style;

	var lineHeight = fontSize;

	var heightInLines = Math.floor((height - y) / fontSize); 
	//var heightInLines = Math.floor((this.display.height - this.display.y) / this.font.size); 

	//Referesh the background color


	//Get formated text.  Has to occur after refresh because that sets the font!!!
	//var formattedText = this.formatText(text);   //formattedText holds formmated lines of text

	//Refersh background image (or images?) if there are any
	refreshImage();

	//Fit text to display height
	if(text.length >= heightInLines){
		var overCount = text.length - heightInLines;
		for(var c = 0; c <= overCount; c++){
			text.shift(); //shifts first lines out as text overflows display area
		}
	}

	//Draw contents of keyBuffer onto canvas
	for(var i = 0; i <= text.length-1; i++) {
	
		this.canvas.ctx.fillText(text[i], x, y + (lineHeight * (i + 1)));		
	}	

	
	/*
	function setFont(){
		//Set font size, type, and color
		this.canvas.ctx.font = fontSize + "px " + fontStyle;
		this.canvas.ctx.fillStyle = fontColor;	
	}
	*/

	function refreshImage(){

	}	

}
	


//############################################################################################################################################
//TERMINAL OBJECT CONSTRUCTOR FUNCTION
//============================================================================================================================================
//The terminal displays command input and sends it to the game engine when it is entered
//		It will also temporarily hold display output untill we create a display window object
//--------------------------------------------------------------------------------------------------------------------------------------------
export const Terminal = function (displayArea, font, canvas){

    Display.call(this, displayArea, font, canvas);
    //Inherits the folowing properties from Display:
    	//this.display
    	//this.font
	this.prompt = ">>";        				//Style of prompt - defined within constructor for now
	this.keyBuffer = [this.prompt];   		//holds lines of text entered by keystroke, creating new entries in the array for carriage returns
	this.commands = [];         				//holds text for each command. Whenever enter is hit, the last line in keyBuffer is assigned to this

	this.init();

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

	//var charSize = this.font.size * 0.55;
	var margin = 2;
	//var widthInChars = Math.round((this.display.width - this.display.x) / charSize);            //var widthInChars
	//var heightInLines = Math.floor((this.display.height - this.display.y) / this.font.size);                 //var heightInLines
	
	//variables from draw
	/*
	var x = this.display.x,
		y = this.display.y,
		width = this.display.width,
		height = this.display.height,
	var fontSize = this.font.size,
		fontColor = this.font.color,
		fontStyle = this.font.style;

	var lineHeight = fontSize;

	var heightInLines = Math.floor((height - y) / fontSize); 
	*/



	this.drawText(self.keyBuffer);
	//console.log("initializing terminal!", self.keyBuffer);


	//Add basic key listener event
	document.addEventListener('keypress', function(key){
		//Declare some basic variables
		//console.log('hitting the keys');
		//var widthInChars = self.widthInChars;
		var pos = 0;
		var temp;
		var command = ""; //holds a command to be added to commands array


		//Decalre some utility functions
		var addNewLine = function(){
			
			//need to send the commandLine to the engine now

			//set keybuffer to formattedText to reduce load on drawText
			//self.keyBuffer = self.formatText(self.keyBuffer);

			self.keyBuffer[self.keyBuffer.length - 1] = text;
			command = self.keyBuffer[self.keyBuffer.length -1].slice(2);
			self.keyBuffer.push(temp);

			self.commands.push(command);  //push entered text to commands buffer
			//console.log("sending command:", terminal.commandLine);
			//console.log("sending command:", self.commandLine);
			//console.log("My number of lines is:", heightInLines);
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
	//Object.getPrototypeOf(new Display(this.display, this.font, this.canvas)).drawText.call(this, text);
	//console.log("drawing:", text);
	//var displayBuffer = this.displayBuffer
	text = this.formatText(text);

	//console.log("drawing formated:", text);

	var ctx = this.canvas.ctx;

	this.refreshBackground();
	this.setFont();
	
	var x = this.display.x,
		y = this.display.y,
		width = this.display.width,
		height = this.display.height,
		marginBottom = this.display.marginBottom
		background = this.display.background;
	var fontSize = this.font.size,
		fontColor = this.font.color,
		fontStyle = this.font.style;

	var lineHeight = fontSize;

	//var heightInLines = Math.floor((height - y) / fontSize); 
	var heightInLines = Math.floor(height / lineHeight); 

	//console.log("my height in lines:", heightInLines);
	//var heightInLines = Math.floor((this.display.height - this.display.y) / this.font.size); 

	//Referesh the background color


	//Get formated text.  Has to occur after refresh because that sets the font!!!
	//var formattedText = this.formatText(text);   //formattedText holds formmated lines of text

	//Refersh background image (or images?) if there are any
	refreshImage();

	//Fit text to display height
	if(text.length >= heightInLines){
		var overCount = text.length - heightInLines;
		for(var c = 0; c <= overCount; c++){
			text.shift(); //shifts first lines out as text overflows display area
		}
	}

	//Draw contents of keyBuffer onto canvas
	for(var i = 0; i <= text.length-1; i++) {
	
		this.canvas.ctx.fillText(text[i], x, y + (lineHeight * (i + 1)));		
	}	

	
	/*
	function setFont(){
		//Set font size, type, and color
		this.canvas.ctx.font = fontSize + "px " + fontStyle;
		this.canvas.ctx.fillStyle = fontColor;	
	}
	*/

	function refreshImage(){

	}	

	
	//This public property holds the formatted text array used in Display.drawText
	var cursorLineHeight = (text.length) * lineHeight;
	
	//DRAW THE CURSOR OBJECT
	var cursorX = x + ctx.measureText(text[text.length - 1]).width; 
	var cursorY  = y + cursorLineHeight + (lineHeight * 0.20); //+ (lineHeight);
	
	//The following throws an error if terminal display height is 100 or less than canvas.height
	if(text[text.length -1].length >= this.widthInPixels) {
		cursorY += lineHeight;
		cursorX = x;
	}
		

	ctx.fillStyle = fontColor;
	ctx.fillRect(cursorX, cursorY, fontSize * 0.55, 2);	
	
}


/* #####################################################################################################################################################
   ############################               MAIN SECTION OF TERMINAL-APP : 
   #####################################################################################################################################################	
*/


/*
	NEW DATA STRUCTURE FOR displayBuffer on Terminal

	var displayBuffer = [
		
		["line"],
		["line"],
		["partial", "partial", "partial"]

	]

	NEW DATA STRUCTURE FOR displayBuffer on Display

	var displayBuffer = [
		
		["line"],
		["line"],
		["partial", "partial", "partial"]

	]

	
	
*/
