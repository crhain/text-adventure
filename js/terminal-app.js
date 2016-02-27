
/*
	To Do:
	 2. drawText method will display all lines in keyBuffer array, while making sure they fit the line. 
	    **** word wrap currently is broken
	
	Basic terminal
	- !!!! Need to fix word wrap
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


/*
	DISPLAY OBJECT CONSTRUCTOR FUNCTION
	  contains basic properties for displaying text
*/
function Display(displayArea, font){
	this.display = displayArea;		//{x:pos, y:pos, width:number, height:number, background:color_string} object that defines display
	this.font = font;				//{color:string, size:integer, style:string} object that defines font
	this.text = "";					//represents the string of text to be displayed
	this.displayBuffer = [];        //holds formated text to be displayed - do not use directly. this is a hack so that Terminal.drawText can reference Display.drawText properly
};

/*
	DISPLAY: drawText method
	
	Inputs: 
			text = an array of text lines to be displayed
	Outputs:
			draws on the canvas.  Currently looks at global variables to get canvas, but can be
			 updated so that it gets canvas context reference in arguments
*/
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

	var displayMaxLines = Math.floor(height / lineHeight);	
	var lineCharLength = Math.round(width / charSize - margin);


	//Redraw canvas background to erase current text and images	
	ctx.fillStyle = background;
	ctx.fillRect(x, y, width, height);

	//Set font size, type, and color
	ctx.font = fontSize + "px " + fontStyle;
	ctx.fillStyle = fontColor;

	//!!!! Last array entery could be longer than a line or more
	//     So it needs to be broken up.
	//     best to create a temporary array for displaying	
	var pos,
		excess,
		currentLineText,
		newLineText;
	console.log("SCREEN LINE SIZE:", lineCharLength);	

	//Format the contents of text and add to displayText
	for(var n=0; n < text.length; n++){
		//displayText.push(text[i]);
		currentLineText = text[n];

		if(currentLineText.length <= lineCharLength){  //This adds all lines that were created either with carriage returns or which are less than or equal to line length
			console.log("ADD REGULAR: index:", n, "length:", currentLineText.length);
			displayText.push(currentLineText);
		}
		else{   //This will parce any line that is longer than the line length
			//current line is longer than display width so need to break it up
			//pos = lineCharLength + 1;
			//excess = currentLineText.length - lineCharLength;
			var currentLineLength = currentLineText.length;
			/*
				problem with my nNewLine function is it assumes a full line will be full line length (42), but a full line can be less than this.
				Therefore, it is possible for the algorithim to stop choping up and pushing the line when there is still line to be pushed.

				So we have to calculate lines differently.  Basically, we need to keep adding lines as long as currentLineText.length > 0
			*/
			var nl = 0;
			//var nNewLines = Math.ceil(currentLineLength / lineCharLength);  //this should give an accurate number of full and partial lines
			console.log("PARCING OVERFLOW LINE: length:", currentLineText.length, "nLines:");
			//for(var nl = 0; nl < nNewLines; nl++){  //adding all new full line segments
			while(currentLineText.length > 0)	{
				//if the currentLineLength is less than a full line, then just add it
				if(currentLineText.length <= lineCharLength){
					newLineText = currentLineText;
					currentLineText = "";
				}
				else{ //It is greater than the line character line, so it must be sniped
					wordWrapOffset = getWordWrapOffset(currentLineText.slice(0, lineCharLength), lineCharLength);
					newLineText = currentLineText.slice(0, lineCharLength - (wordWrapOffset-1));
					currentLineText = currentLineText.slice(lineCharLength - (wordWrapOffset-1));  //Set currentLineText to remainder of line

				}

				//if the currentLineLength is at least lineCharLength or greater, cut off a segement less or equal to lineCharLength depending on word wraping
				
				console.log("ADD FULL OVERFLOW: index:", n+nl, "length:", newLineText.length);;  //This code never gets fired
				console.log("---Adding:", newLineText);
				displayText.push(newLineText);		
				this.displayBuffer = displayText;
				nl++;
				//}				
				
			}

		} 
	}	


	//Fit text to display height
	
	if(displayText.length > displayMaxLines){
		var overCount = displayText.length - displayMaxLines;
		for(var c = 0; c < overCount; c++){
			displayText.shift(); //shifts first lines out as text overflows display area
		}
	}

	
	//Draw contents of keyBuffer onto canvas
	for(var i = 0; i <= displayText.length-1; i++) {
	
		ctx.fillText(displayText[i], 0, lineHeight * (i + 1));		
	}	

	//set objects displayBuffer to displayText so that it can be accessed outside object
	this.displayBuffer = displayText;

		
	function getWordWrapOffset(line, lineCharLength){
			//test for break on word and if so, then reset position to space before word
			var offSet = 0;
			if(line[lineCharLength-1] != " "){
				var spacePos = line.lastIndexOf(" ");
				console.log("SPACE POS=", spacePos);
				if(spacePos == -1)
					return offSet;
				offSet = (lineCharLength - spacePos);				
			}
			console.log("WORD OFFSET=", offSet);
			return offSet;
	}

};
	


/*
	TERMINAL OBJECT CONSTRUCTOR FUNCTION
		The terminal displays command input and sends it to the game engine when it is entered
		It will also temporarily hold display output untill we create a display window object
*/
function Terminal(displayArea, font){

    Display.call(this, displayArea, font);
    //Inherits the folowing properties from Display:
    	//this.display
    	//this.font
	this.prompt = ">>";        				//Style of prompt - defined within constructor for now
	this.keyBuffer = [this.prompt];   		//holds lines of text entered by keystroke, creating new entries in the array for carriage returns
	var commandText;         				//holds text for each command. Whenever enter is hit, the last line in keyBuffer is assigned to this

	//Call function to initialize the terminal.
	this.init();

};

//Set up Terminal object constructor to inheriet methods from Display
Terminal.prototype = Object.create(Display.prototype); 
Terminal.prototype.constructor = Terminal;  //gives it correct constructor method


/*
	TERMINAL: init method
	
	Sets up event listeners to capture keystrokes and call drawText method to draw them.
*/
Terminal.prototype.init = function(){
	self = this;  //to create a reference to the terminal and not to the item calling the event listener
	
	keyBuffer = self.keyBuffer; //key buffer holds an array of lines (delimited by carriage returns)
	prompt = self.prompt;       //text for prompt
	var text = prompt;  //this is a temporary string to hold key inputs in listeners

	console.log("initializing terminal!", keyBuffer);


	//Add basic key listener event
	document.addEventListener('keypress', function(key){
		//Declare some basic variables
		console.log('hitting the keys');
		var charSize = terminal.font.size * 0.55;
		var margin = 2;
		var lineCharLength = Math.round(canvas.width / charSize - margin); //!!!!!might want to move definition of this
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
		//Add text to end of keybuffer
		else{
			//console.log("This should not create new lines!");
			keyBuffer[keyBuffer.length - 1] = text;	
		}

		//Rewdraw console text				
		self.drawText(keyBuffer);
		
		
	} );

	//Add evend listener to capture backspace and prevent default browser action
	document.addEventListener('keydown', function(key){
		if(key.which == 8) {
			key.preventDefault();

			//only delete a character if we are not at the prompt
			if(text.length > prompt.length){
				text = text.slice(0, -1);
				keyBuffer[keyBuffer.length - 1] = text;
				self.drawText(keyBuffer);			
			}		
		}		 
	});	


}; 

/*
	TERMINAL: drawText method
	Based on: Display.drawText method, adds cursor after text
*/


Terminal.prototype.drawText = function(text){

	//This fancy line is calling the original drawText function defined on Display - but it does not give this function access
	// to it's variables, so we need to make variables we need public properties on the ojbect :(
	Object.getPrototypeOf(new Display(this.display, this.font)).drawText.call(this, text);

	//This public property holds the formatted text array used in Display.drawText
	var displayText = this.displayBuffer;

	
	var fontSize = this.font.size,
		lineHeight = fontSize;

	//Draw the cursor
	var cursorX = ((displayText[displayText.length - 1].length + 1) * (fontSize * 0.55)) - (8);
	var cursorY  = ((displayText.length-1) * lineHeight) + (lineHeight);

	ctx.fillStyle = 'white';
	ctx.fillRect(cursorX, cursorY, fontSize * 0.55, 2);	

};





/* #####################################################################################################################################################
   ############################               CANVAS VARIABLES & FUNCTIONS; DECLARE TERMINAL OBJECT
   #####################################################################################################################################################	
*/


//More variables. Do not change!
var body = document.querySelector('body');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

//var cursorX = 0,
//	cursorY = 0;

//var displayArea;

canvasInit();  //Initialize the canvas

//Creates terminal object
var terminal = new Terminal({
		x:0,
		y:0,
		width:1198,
		height:798,
		background:'green'
	},
	{
		color:'black',
		size: 50,
		style: 'monospace'
	}
);


//Draw initial text
terminal.drawText(keyBuffer);


//initalize the canvas
function canvasInit(){
	canvas.width = 1200;
	canvas.height = 800;
	//displayArea = {x:0, y:0, width:canvas.width, height:canvas.height, background:'green'};  //Just a temporary display area for terminal drawText function

	ctx.fillStyle = 'green';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//window.requestAnimationFrame(drawCursor);
}