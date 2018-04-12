var game = (function () {
	// 'use strict';

	//#####################################################################################################
		//getMatchedItem:
		//-----------------------------------------------------------------------------------------------------
		//  Inputs:
		//		words - a list/array of strings to be searched against
		//      target - a second list to search against words for a match
		//      property(optional) - if list contains objects, then the property to access
		//  Return: the list item that was matched or false if no match
		//#####################################################################################################      
		const getMatchedItemInList = function (words, target, property) {

			var sentence = words.join(" ").toLowerCase();
			var item = undefined;
			var value;

			//console.log("word list is:", sentence);

			//Now iterate over the target list
			for(var i = 0; i < target.length; i++){
				if(property)
					value = target[i][property];
				else
					value = target[i];
				//console.log("my item name is:", target[i][property]);
				if(sentence.search(value.toLowerCase()) != -1){
					item = target[i];
					return item; //return the item in the list that matched
				}
			}

			return item;
		};
		//#####################################################################################################
		//getMatchedItem:
		//-----------------------------------------------------------------------------------------------------
		//  Inputs:
		//		words - a list/array of strings to be searched against
		//      target - a second list to search against words for a match
		//      property(optional) - if list contains objects, then the property to access
		//  Return: the list item that was matched or false if no match
		//
		//   add: could use arguments and iterate through them to get nested properties?
		//#####################################################################################################      
		const removeMatchedItemInList = function  (words, target, property) {
			var sentence = words.join(" ").toLowerCase();
			var value;
			var item = undefined;

			//Now iterate over the target list
			for(var i = 0; i < target.length; i++){
				if(property)
					value = target[i][property];
				else
					value = target[i];
				if(sentence.search(value.toLowerCase()) != -1){
					item = target[i]; //return the item in the list that matched
					target.splice(i, 1);  //removes item from target
				}
			}

			return item;
			
		};


		const getMatchedItemInObject = function (words, target, property) {
			var sentence = words.join(" ").toLowerCase();
			var value;
			var item = undefined;
			//console.log("word list is:", sentence);

			//Now iterate over the target list
			for(key in target){
				if( target.hasOwnProperty(key) && target[key]){
					if(property)
						value = target[key][property];
					else
						value = target[key];
					//console.log("my item name is:", target[i][property]);
					if(sentence.search(value.toLowerCase()) != -1){
						item = target[key];
						return item; //return the item in the list that matched	
					}
				
				}
			}

			return item;

		};

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
	const Canvas = function (width, height, tag) {
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

	const Display = function (displayArea, font, canvas){
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

	};

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
	};

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
	};

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
	};
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

		
	};

	//set the current font on the canvas
	Display.prototype.setFont = function(font){
		if(font === undefined)
			font = this.font;

		var fontSize = font.size;
		var fontColor = font.color;
		var fontStyle = font.style;

		this.canvas.ctx.font = fontSize + "px " + fontStyle;
		this.canvas.ctx.fillStyle = fontColor;	

	};


	//Pushes text array to display buffer
	Display.prototype.addTextToDisplayBuffer = function(text){
		
		if(typeof(text) === 'string')
			text = [text];

		var self = this;

		text.forEach(function(currentLine, index){
			self.displayBuffer.push(currentLine);
		});
	};


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

		//Have to declare these here because these will set themselves properly when calling through terminal draw function!
		//var heightInLines = Math.floor(height - y / fontSize);	
		//var widthInChars = Math.round(width - x / charSize - margin);

		//This is now only being used to estimate how many characters fit in a line.  It is set so that it is large enough so that it will be larger than line.
		//This helps the line fitting alogrithim to be more efficent since it only has to trim down a smaller line instead of the entier text line.
		var widthInChars = Math.round((this.display.width - this.display.x) / (fontSize * 0.12) );
		var widthInPixels = this.display.width;                                                               //if we add in margins, these will have to be figured in.
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
	};

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

	};
		


	//############################################################################################################################################
	//TERMINAL OBJECT CONSTRUCTOR FUNCTION
	//============================================================================================================================================
	//The terminal displays command input and sends it to the game engine when it is entered
	//		It will also temporarily hold display output untill we create a display window object
	//--------------------------------------------------------------------------------------------------------------------------------------------
	const Terminal = function (displayArea, font, canvas){

	    Display.call(this, displayArea, font, canvas);
	    //Inherits the folowing properties from Display:
	    	//this.display
	    	//this.font
		this.prompt = ">>";        				//Style of prompt - defined within constructor for now
		this.keyBuffer = [this.prompt];   		//holds lines of text entered by keystroke, creating new entries in the array for carriage returns
		this.commands = [];         				//holds text for each command. Whenever enter is hit, the last line in keyBuffer is assigned to this

		this.init();

	};

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
			};

			
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

	}; 


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
			marginBottom = this.display.marginBottom;
			background = this.display.background;
		var fontSize = this.font.size,
			fontColor = this.font.color,
			fontStyle = this.font.style;

		var lineHeight = fontSize;

		//var heightInLines = Math.floor((height - y) / fontSize); 
		var heightInLines = Math.floor(height / lineHeight); 

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
		
	};


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

	/* 
	############################################################################################################################################################################################
	############################################################################################################################################################################################
	GAME-ACTORS.JS
	============================================================================================================================================================================================
	Overview: contains objects defining any actor in the game, including player, friendlies, and hostiles.
	============================================================================================================================================================================================		

	###############################################################################################################################################################################################	  
	*/

	const Player = function (data){
		//data is an object with the player data (either passed or object literal)


		this.fullname = 	data.fullname;
		this.sex = 			data.sex;   //set it from character creation once that feature implimented
		this.age = 			data.age;
		//this.physical = 		data.physical;
		//this.bio =			data.bio
		this.baseAttack =			data.baseAttack;
		this.baseDefense =			data.baseDefense;
		this.baseHealth	=			data.baseHealth;
		this.baseArmor =			data.baseArmor;

		
		this.inventory = 			data.inventory;  //list of item objects
		//The following are set to objects representing the items the player has equped

		//	head:{id:'metalhelm1', name: "Old Metal Helm", type:'armor', detail: "a simple metal helm.", slot:'head', armor: 2, defense: 0, weight: 1, value: 5},
		//	neck:undefined,
	//		chest:{id:'lthrjrk', name: "Leather Jerkin", type:'armor', detail: "a leather jerkin.", slot:'chest', armor: 8, defense: -5, weight: 15, value: 20},
	//		lfinger:undefined,
	//		rfinger:undefined,
	//		rhand:{id:'woodclub', name: "wood club", type:'weapon', detail: " a wood club with a few knicks in it.", slot:'rhand', damage: 10, weight: 5, value: 1},
	//		lhand:undefined,
	//		feet:{id:'wornlthrboots', name: "Worn Leather Boots", type: 'armor', detail: " some old leather boots.", slot:'feet', armor: 2, defense: 0, weight: 1, value: 5}
		
		this.equiped = 				data.equiped;

		this.attack =				data.attack;
		this.defense = 				data.defense;
		this.health =				data.health;
		this.armor =				data.armor;

		
		this.dead = false;
	};

	Player.prototype = Object.create(Object.prototype);


	//=============================================================================================================================================================================
	//                   PUBLIC METHODS
	//=============================================================================================================================================================================


	//===========================================================================================
	//EQUIP ITEM METHOD - removes item from intenvory and adds it an equipment slot
	//===========================================================================================



	//===========================================================================================
	//EQUIP ITEM METHOD - removes item from intenvory and adds it an equipment slot
	//===========================================================================================
	Player.prototype.equipItem = function(item, slot){

		var success = false;

		if(this.removeItemFromInventory(item)){ //remove item from inventory and continue if succesfull

			if(this.equiped[slot] && this.equiped[slot].id != 'empty'){  //if something is in the equiped slot other than 'empty' item			
				
				this.unequipItem(this.equiped[slot], slot);	 //unequip that item (putting it in inventory)	
							
			}
			this.equiped[slot] = item;  //I have to use bracket notation instead of dot notation when using a string name for an object property!
			this.addItemStats(item); //update Player stats based on item added
			success = true;
		}
		
		return success;	

	};

	//===========================================================================================
	//UNEQUIP ITEM METHOD - removes item from slot and places into inventory
	//===========================================================================================
	Player.prototype.unequipItem = function(item, slot){

		if(item.id == 'empty'){ //if empty empty equiped then it cannot be unequiped

			return false;
		}
		else{
			this.addItemToInventory(item);
			this.removeItemStats(item);
			this.equiped[slot] = {id:'empty', name:'None'}; //this is the empty object - it cannot be unequiped for obvious resons	
		}
		
		return true;
	};


	//===========================================================================================
	//SAVE METHOD - saves player data to local storage
	//===========================================================================================
	Player.prototype.save = function(){
		//window.localStorage.setItem(application, this.here.id);
		//if(window.localStorage.getItem(application)){
		//	window.localStorage.removeItem(application);
		//}	
		//I need go through all rooms, reading out all their properties that are not methods
		var jsonData = JSON.stringify(this);
			
		window.localStorage.setItem('player', jsonData);
		
		//window.localStorage[application].data = this;  //see if this works
	};


	//===========================================================================================
	//CLEAR SAVE METHOD - removes saved player data from localStorage
	//===========================================================================================
	Player.prototype.clearSave = function(){
		window.localStorage.removeItem('player');
	};





	//=============================================================================================================================================================================
	//                   PRIVATE METHODS
	//=============================================================================================================================================================================


	//===========================================================================================
	//ADD ITEM TO INVENTORY METHOD - adds item to players inventory
	//===========================================================================================
	Player.prototype.addItemToInventory = function(item){
		//may have to add some code to check for duplicates or
		//allow for stacking of items
		this.inventory.push(item);
	}; 


	//===========================================================================================
	//REMOVE ITEM FROM INVENTORY METHOD - removes an item from players inventory
	//===========================================================================================
	Player.prototype.removeItemFromInventory = function(item){
		//may add some code to allow subtracting from stacks
		var success = false;
		//loop through inventory looking for item
		for(var i = 0; i < this.inventory.length; i++){
			if(this.inventory[i].id == item.id){
				success = true;
				//console.log("deleting", item.name, "at index", i, "from inventory.")
				this.inventory.splice(i, 1); //delete the item from inventory if matched
				//console.log("inventory is now:", this.inventory);
			}
		}

		return success;
	};

	//experimental
	Player.prototype.getItemInInventory = function(words){
		return getMatchedItemInList(words, this.inventory, 'name');
	};

	//===========================================================================================
	//REMOVE ITEM STATS - removes item stats from player (used when an item is unequiped)
	//===========================================================================================
	Player.prototype.removeItemStats = function(item){
		for(stat in this){
			if(this.hasOwnProperty(stat)){
				if(stat in item){
					this[stat] -= item[stat];
				}
			}
		}
	};

	//===========================================================================================
	//ADD ITEM STATS - adds item stats  (used when an item is equiped)
	//===========================================================================================
	Player.prototype.addItemStats = function(item){
		for(stat in this){
			if(this.hasOwnProperty(stat)){
				if(stat in item){
					this[stat] += item[stat];
				}
			}
		}
	};


	/*
	//############################################################################################################################################
	ACTOR OBJECT CONSTRUCTOR FUNCTION (based on Player object)
	============================================================================================================================================
	OVERVIEW: object constructor for an actor object. Actors represent any mobile character in the game, including enemies, friendlies, and 
	merchtants.

		INPUTS:  data : an object literal that contains all data needed to create an actor object

		OUTPUTS: returns an Actor object
	#############################################################################################################################################
	*/

	const Actor= function(data){

		//Player.call(this, data);  //currently the player uses fullName property and actors use name properties

		this.id = data.id;
		this.name = data.name;
		this.detail = data.detail;
		this.hostile;
	};

	Actor.prototype = Object.create(Player.prototype);
	Actor.prototype.constructor = Actor;  //gives it correct constructor method

	//Show actors detailed description
	Actor.prototype.show = function(display, intro){
		var text = "";
			if(intro) 	text = intro;

			//show room description
			display.showText(text + this.detail);		
	};

	/* 
	############################################################################################################################################################################################
	############################################################################################################################################################################################
	GAME-ITEMS.JS
	============================================================================================================================================================================================
	Overview:	
	============================================================================================================================================================================================		
	To Do:			
	============================================================================================================================================================================================
	Notes:
		    
	###############################################################################################################################################################################################	  
	*/

	const Item = function (data){
		this.id = 					data.id;
		this.name = 				data.name;
		//this.detail_placed =		data.detail_placed;   //this represents the description of the item the first time it is viewed
		//this.detail_dropped =		data.detail_dropped  //this represents the description of the item when it is dropped
		this.detail =				data.detail;         //this is the item detail when player looks at the item
		//this.value =				data.value;          //value in 
		//this.weight =				data.weight;
		this.fixed = false;
		this.inContainer = false;    //property that prevents items from being shown by look command if they are in a container.  Must look at the container itself

		//determine fixed property and set to default if not set.  Fixed indicates if the player can get the object or not.
		if(data.hasOwnProperty(this.fixed)){
			this.fixed = data.fixed;
		}
		
					

	};

	Item.prototype = Object.create(Object.prototype); 

	//Method: displays the items details
	Item.prototype.show = function(display, intro){
		var text = "";
			if(intro) 	text = intro;

			//show room description
			display.showText(text + this.detail);		
	};

	/*
	//############################################################################################################################################
	ARMOR OBJECT CONSTRUCTOR FUNCTION (Inherits from Item)
	============================================================================================================================================
	OVERVIEW: object constructor for any weareable object. 

		INPUTS:  data : an object literal that contains all data needed to create this object

		OUTPUTS: returns an Item object
	#############################################################################################################################################
	*/
	const Armor = function (data){

		Item.call(this, data);

		this.type = data.type;
		this.slot = data.slot;
		this.armor = data.armor;
		this.defense = data.defense;
	};

	Armor.prototype = Object.create(Item.prototype);
	Armor.prototype.constructor = Armor;  //gives it correct constructor method

	/*
	//############################################################################################################################################
	WEAPON OBJECT CONSTRUCTOR FUNCTION (Inherits from Item)
	============================================================================================================================================
	OVERVIEW: object constructor for object that can be used as a weapon. 

		INPUTS:  data : an object literal that contains all data needed to create this object

		OUTPUTS: returns an Item object
	#############################################################################################################################################
	*/
	const Weapon = function (data){

		Item.call(this, data);

		this.type = 		data.type;
		this.slot = 		data.slot;
		this.damage = 		data.damage;

	};

	Weapon.prototype = Object.create(Item.prototype);
	Weapon.prototype.constructor = Weapon;  //gives it correct constructor method


	/*
	//############################################################################################################################################
	CONTAINER OBJECT CONSTRUCTOR FUNCTION (Inherits from Item)
	============================================================================================================================================
	OVERVIEW: object constructor for object that is fixed and can contain other objects 

		INPUTS:  data : an object literal that contains all data needed to create this object

		OUTPUTS: returns an Item object
	#############################################################################################################################################
	*/
	const Container = function (data){

		Item.call(this, data);

		this.type = data.type;
		this.fixed = true;  //set fixed property to true by default (overrides item fixed property)
		this.closed = true;  //change this to obtain state from data later on
		this.locked = false; //change this to obtain state from data later on

		this.contents = [];


		for(var i = 0; i < data.contents.length; i++){
			if(data.contents[i].hasOwnProperty('type')){
				if(data.contents[i].type == 'armor'){
					this.contents.push(new Armor(data.contents[i]));
				}							
				else if(data.contents[i].type == 'weapon'){
					this.contents.push(new Weapon(data.contents[i]));
				}
				else if(data.contents[i].type == 'container'){
					this.contents.push(new Container(data.contents[i]));
				}			  			
				else{
					this.contents.push(new Item(data.contents[i]));  
				}
			}
			else{
				this.contents.push(new Item(data.contents[i]));	
			}		
		}
	};

	Container.prototype = Object.create(Item.prototype);
	Container.prototype.constructor = Container;  //gives it correct constructor method


	Container.prototype.removeItem = function(item){
		//find item in rooms list of items
		for(var i = 0; i < this.contents.length; i++){
			if(item.id == this.contents[i].id){
				this.contents.splice(i, 1);
			}
		}	
	};

	/*
	 ITEM - object that wraps basic items
	  Item types:
	  	1. Item
	  	2. Clothing = can be worn
	  	3. Weapon
	  	  - sword
	  	  - spear
	  	  - axe
	  	4. Drink
	  	5. Food
	  	6. 


	*/

	/* 
	############################################################################################################################################################################################
	############################################################################################################################################################################################
	GAME-ROOMS.JS
	============================================================================================================================================================================================
	Overview: contains constructor for 
	  - Adventure object :  holds all Room objects that make up a single adventure and also provides functions for loading in adventure data
	  - Room ojbect : holds all objects	that go into rooms, including actors, items, and exits?
	============================================================================================================================================================================================		
	To Do:			
	============================================================================================================================================================================================
	Notes:
		    
	###############################################################################################################################################################################################	  
	*/

	var store = {"id":"room2", "name":"Neat", "detail": "really neato, right?"};
	var strStore = JSON.stringify(store);

	const Adventure = function (data){

		//sets starting location to start.  If no start argument given, then set to first room
		

		//wrap game object elements
		this.title = data.title;
		this.author = data.author;
		this.detail = data.detail;
		this.rooms = [];

		
		//Get rooms
		for(var r = 0; r < data.rooms.length; r++){
			this.rooms.push(new Room(data.rooms[r]));
		}
		
		var startRoom = this.getRoomByID(data.start);
		if(startRoom){
			this.here = startRoom;	
		}
		else{
			//this returns last room in array for some reason?  But array is in right order... so.
			this.here = this.rooms[0];
		}
		
		
		//if(start) this.here = start; else this.here = data.rooms[0];

		//this.items = data.items;
		//this.actors = data.actors;
		//this.dialog = data.dialog;

	};

	//Set up Terminal object constructor to inheriet methods from Display
	Adventure.prototype = Object.create(Object.prototype); 
	//Room.prototype.constructor = Room;  //gives it correct constructor method

	Adventure.prototype.init = function(rooms){
		

	};

	//creates save file for adventure data
	//you cannot save objects on localStorage, so we must convert all objects to json strings using JSON.stringify(data);
	//and then when loading we must convert back to an object using JSON.parse(jsonstring);
	Adventure.prototype.save = function(){
		//window.localStorage.setItem(application, this.here.id);
		//if(window.localStorage.getItem(application)){
		//	window.localStorage.removeItem(application);
		//}
		

		//I need go through all rooms, reading out all their properties that are not methods
		var jsonData = JSON.stringify(this);
			
		window.localStorage.setItem(application, jsonData);
		
		//window.localStorage[application].data = this;  //see if this works
	};

	Adventure.prototype.clearSave = function(){
		window.localStorage.removeItem(application);
	};





	//Returns a room object basedon name
	Adventure.prototype.getRoomByID = function(id){
		var room = {detail:'error!!!'};
		
		//console.log("looking for id:", id);
		//using a regular for loop instead of .forEach because you cannot return out of a .forEach without loosing scope of .forEach passed arguments.
		for(var i = 0; i < this.rooms.length; i++){
			room = this.rooms[i];
			//console.log("looking at room id:", room.id);
			if(room.id == id){
				//console.log("found room id:", id, "matching room id:", room.id)
				//console.log("this is the room:", room);
				return room;
			}
		}

		return room;
	};

	//A wrapper function that sets Map object here property by retrieving room with getRoomByID method
	Adventure.prototype.setHere = function(roomID){
		//console.log("setting here to id:", roomID);
		var temp = this.getRoomByID(roomID);
		//console.log("this is the room obj:", temp)
		this.here = temp;
		//console.log("here is now equal to:", this.here);
	};


	const Room = function(data) {
		//create properties representing basic room data
		this.id = data.id;
		this.name = data.name;
		this.detail = data.detail;
		this.exits = data.exits;  //for now we just declare exits as object literals 
		this.actors = [];
		this.items = [];

		//create actor list
		for(var a = 0; a < data.actors.length; a++){
			this.actors.push(new Actor(data.actors[a]));
			console.log('creating ', this.actors[a].name);
		}
		

		//create item list - for now, it just creates all items as type item
		//but if we use different objects for items, we will have to first get object type and then decide
		//what type of item to create.
		for(var i = 0; i < data.items.length; i++){
			if(data.items[i].hasOwnProperty('type')){
				if(data.items[i].type == 'armor'){
					this.items.push(new Armor(data.items[i]));
				}							
				else if(data.items[i].type == 'weapon'){
					this.items.push(new Weapon(data.items[i]));
				}
				else if(data.items[i].type == 'container'){
					this.items.push(new Container(data.items[i]));
				}			  			
				else{
					this.items.push(new Item(data.items[i]));  
				}
			}
			else{
				this.items.push(new Item(data.items[i]));	
			}		
		}

	};


	Room.prototype = Object.create(Object.prototype); 


	//Show room description and contents
	Room.prototype.show = function(display, intro){
		var text = "";
			if(intro) 	text = intro;

			display.clear(); //clear the buffer first to make it  pretty
			//show room description
			display.showText(text + this.detail);
			//show item descriptions
			if(this.items){
				this.items.forEach(function(item){
					display.showText("You see " + item.detail);
				} );	
			}
			
			//show actors
			if(this.actors){
				this.actors.forEach(function(actor){
					display.showText(actor.name + " is here.");
				} );
			}
	};

	Room.prototype.removeItem = function(item){
		//find item in rooms list of items
		for(var i = 0; i < this.items.length; i++){
			if(item.id == this.items[i].id){
				this.items.splice(i, 1);
			}
		}
		
	};

	/* 
	#############################################################################################################################################################
	#############################################################################################################################################################
	#############################################################################################################################################################	  
	*/


	function gameEngine() {

		var game;      //holds data for current game

		var running = true;  //if true, then contiue to run the game
		//var here = {};  //game data for current location of player. This engine level varialbe is a wraper for the game.here property?
		

		var player;  //holds data on current character the player is using.  will just set this here right now for testing.
		var canvas;
		var terminal;
		var display;
		var playerdisplay;

		init();  //Starts the game

		//main game loop
		function main(tFrame){

			//calculate animation delay factor by comparing timeStamps - only for if we want animations
			//tFrame provides the time stamp for each frame

			//request a new animation frame and rerun main() - this goes last in main
			if(running){
				console.log('?');
				window.requestAnimationFrame(main);	
			}
			

			//Get scene - add this at latter point
			
			//get command and send to interpreter - is is the core of the game
			if(terminal.commands.length > 0){
				var cmdText = terminal.commands.shift();
				commandInterpreter(cmdText);	
				//update();  //this is only called if a command was entered, as game in turns based on keyboard input - need to write this function
			}
		}
		
		//################################################################################
		//COMMANDS LISTING - shows commands game understands
		//  each one gets 
		//		command: a list of synonoms that are understood by the game (all lower case please!)
		//		callbakc: name of function to 
		//  
		//--------------------------------------------------------------------------------		
		var commands = [
			{
				command: ['quit'],
				handler: cmdQuit
			},
			{
				command: ['clear'],
				handler: cmdClear
			},
			{
				command: ['say', 'yell'],
				handler: cmdSay
			},
			{
				command: ['move', 'go', 'walk', 'head'],
				handler: cmdMove
			},
			{
				command: ['look', 'check', 'examine', 'inspect'],
				handler: cmdLook
			},
			{
				command: ['get', 'take'],
				handler: cmdGet
			},
			{
				command: ['drop', 'discard'],
				handler: cmdDrop
			},
			{
				command: ['equip'],
				handler: cmdEquip	
			},
			{
				command: ['unequip'],
				handler: cmdUnequip	
			},
			{
				command: ['open'],
				handler: cmdOpen
			},
			{
				command: ['inventory', 'inv', 'pack', 'backpack', 'show inventory'],
				handler: cmdInventory
			},
			{
				command: ['player', 'show player'],
				handler: cmdPlayer
			},
			{
				command: ['save'],
				handler: cmdSave
			},
			{
				command: ['delete'],
				handler: cmdDelete
			}
		];
												
		
		//core game logic here. Gets command text, parces it, and then runs various commands
		function commandInterpreter(cmdText){

			var cmdExe = undefined;  //holds the command handler to be executed
			var cmdName = undefined;
			var cmdTokens = [];      //list of command tokens created from cmdText
			var words = [];            //this contains non-command tokens that are passed to the command function as arguments
			var cmdMatched = false;   //this is a hack so that I know that a cmdToken is not a command and can be pushed ot arguments list

			
			var reTokens = /".+"|[^ .]+/gi;  //regular expression that finds words or "strings" in the command string (could add ' ' as well)
			

			//1. use an re to extract all strings or words into cmdTokens list.
			cmdTokens = cmdText.match(reTokens);
			
			if(cmdTokens){
				//2. go through cmdTokens list and see if they are in the commands list
				cmdTokens.forEach(function(tValue, tIndex){
					
					cmdMatched = false;

					commands.forEach(function(cValue, cIndex){
						//3. if a cmdToken is in the commands list, then add its handler to cmdExe
						if(cValue.command.length == 1){
							if(tValue.toLowerCase() == cValue.command[0]){
								cmdExe = cValue.handler;
								cmdName = cValue.command[0];
								cmdMatched = true;
							}
						}		
						else{
							//3. if a cmdToken is in the commands list, then add its handler to cmdExe
							for(var i = 0; i<cValue.command.length; i++){
								if(tValue.toLowerCase() == cValue.command[i]){
									//console.log(cValue.command[i]);
									cmdName = cValue.command[i];
									cmdExe = cValue.handler;
									cmdMatched = true;
								}
							}		
						}				
					} );
					
					//If this cmdToken is not a command, then push it to the words list
					if(!cmdMatched){
							tValue = removeQuotes(tValue);
							words.push(tValue);
							//console.log("pushing", tValue);
						}
			
				} );

				//if no command was found, then call cmdError
				if(cmdExe) cmdExe(words); else cmdError();  //insert cmdText here so that command functions can refer to the exact word matched!!!
					

			}
			
			//!!!I was going to allow stringing of commands by pushing command token to an array, but that would be just too complex right now	
			function removeQuotes(string){
				string = string.replace(/"/g, '');
				return string;
			}

		}


		//################################################################################
		//COMMAND handlers
		//--------------------------------------------------------------------------------

			//QUIT - exit the game
			function cmdQuit(words)
			{
				running = false;
				//display.showText(' ');
				display.showText('Quiting...');
			}

			//wraper for display clear method.  clears the screen of text.
			function cmdClear(words){
				display.clear();	
			}

			//SAY - say whatever words came after the command
			function cmdSay(words){
				//if there is only one arg, then say that
				if(words){
					if(words.length == 1){
						//display.showText(' ');
						display.showText('You say: ' + words);
					}
					else if(words.length > 1){
						//display.showText(' ');
						display.showText('You say: ' + words.join(" ") );
					}
				}
				else{
					//display.showText(' ');
					display.showText('You say nothing!');
				}
				
			}

			//MOVE - takes the name of a door and will move player to connecting room
			function cmdMove(words)
			{
													
				if(!words){
					cmdError();
				}
				else{
					var exits = game.here.exits;  //wraps exits on current room for ease of typing


					//2. compare words with exits using helper function
					var match = getMatchedItemInList(words, exits, 'name');

					if(match) {
						game.setHere(match.link);
						game.here.show(display, "You enter ");	
					}
					else{
						cmdError(["You want to go where?"]);
					}
				}			

			}
			//shows details of items, actors, or the room if no arguments passed
			function cmdLook(words){

				//Note: add logic for looking at containers.  If they are open, then show contents in description.
				
				if(words.length > 0){ //if there are arguments, we need to find out what they are								
					var sentence = words.join(" ");
					//show players inventory
					if(sentence.search("inventory") != -1){  //show inventory (might split this out)
						cmdInventory();									
					}
					//now check to see if words match items or monsters in area
					else{
						//check items in room
						var match = getMatchedItemInList(words, game.here.items, 'name');
						//If not any items, then check actors
						if(!match)
							match = getMatchedItemInList(words, game.here.actors, 'name');
						//if not any actors, check players inventory
						if(!match)
							match = getMatchedItemInList(words, player.inventory, 'name');
						//add exits and player equiped items here, but not right now

						//something matched, so show it's detail
						if(match){
							if(match.detail.length > 0){
								match.show(display, "You see ");
								//display.showText("You see " + match.detail);	
							}
							else{
								match.show(display, "You see a ");
								//display.showText("You see a " + match.name);
							}							
						}
						else{
							cmdError(["You don't see anything like that!"]);
						}
					}
				}
				else{

					game.here.show(display, "You are in ");  //just show the room if there are no arguments
				}		
			}
			//get's item and adds to player inventory
			function cmdGet(words){
				//need to write helper function
				//display.showText('Gettin it!');
				var searchObj = game.here;
				var match = getMatchedItemInList(words, searchObj.items, 'name');

				//if item not found in room, iterate over all existing items looking for containers that are open
				if(!match){
					for(var i = 0; i < searchObj.items.length; i++){
						if(searchObj.items[i].type == 'container' && !searchObj.items[i].closed){
							match = getMatchedItemInList(words, searchObj.items[i].contents, 'name');
							if(match){
								searchObj = searchObj.items[i];  
								break;
							}
						}
					}
						
					
				}

				if(match){
					if(!match.fixed){
						display.showText("You recieve " + match.name);
						searchObj.removeItem(match);
						player.addItemToInventory(match);	
					}				
					else{
						display.showText("That is too heavy to carry!");
					}
					
				}
				else{
					cmdError(["You want to get what?"]);
				}
					
			}
			//DROP command
			function cmdDrop(words){

				if(words.length < 1){
					cmdError("Drop what?");
				}
				else{
					//getting item by name presently, but could also pass number (index + 1)
					var item = removeMatchedItemInList(words, player.inventory, 'name');
					if(item){
						display.showText("Dropped " + item.name);
						game.here.items.push(item);	
					}
					else{
						cmdError("You don't have one of those!");
					}
				}			

			}
			//adds items from players inventory to equiped slots
			function cmdEquip(words){
				//1. get the item from inventory (if it exists)
				var item = getMatchedItemInList(words, player.inventory, 'name');
				//check to see if an item was found. If it was then euqip it.  If not, send error
				if(item && player.equipItem(item, item.slot)){
					//call player equipItem method to equip the item and remove equiped items in slot
					//display text saying item was equiped
					display.showText("Equiped " + item.name);					
				}
				else{
					cmdError(["Can't find that in your inventory!"]);
				}

			}
			//adds items from players equiped slots to inventory
			function cmdUnequip(words){
				//1. check through all equpment slots for item
				var item = getMatchedItemInObject(words, player.equiped, 'name');

				//2. if found, then remove from slot and add to inventory
				if(item && player.unequipItem(item, item.slot)){				
					display.showText("You unequip " + item.name);	
				}
				else{
					cmdError(["Nothing to unequip!"]);	
				}			
			}


			function cmdOpen(words){
				var item = getMatchedItemInObject(words, game.here.items, 'name');
				if(item){
					if(item.type == 'container'){
						//1. set state to opened
						item.closed = false;
						//2. show contents of container
						if(item.contents){
							display.showText("The " + item.name + " contains:");
							item.contents.forEach(function(item, index){
								display.showText((index + 1) + ". " + item.name, true);
							} );
						}
						else{
							display.showText("The " + item.name + " is empty.");
						}

					}
					else{
						cmdError(["You cannot open that!"]);
					}

				}

				//add code for opening doors here - if feature added.			
			}

			//show player inventory - takes no arguments so rest of sentence will be ignored
			function cmdInventory(){
				if(player.inventory.length < 1){
					display.showText("You have nothing in your inventory!");
				}
				else{
					display.showText("You have the following items in your inventory:");	
						player.inventory.forEach(function(item, index){
						display.showText((index + 1) + ". " + item.name, true);
					});
				}	
			}

			function cmdPlayer(){

				playerdisplay.clear();
				//display name
				playerdisplay.showText("NAME:" + player.fullname);
				playerdisplay.showText("SEX:" + player.sex + "     AGE:" + player.age);
				playerdisplay.showText("ATTACK:" + player.attack + "     DEFENSE:" + player.defense + "     ARMOR:" + player.armor + "     HEALTH:" + player.baseHealth + "/" + player.health);
				//display equiped items
				playerdisplay.showText("EQUIPED:");

				
				for (slot in player.equiped){
					if( player.equiped.hasOwnProperty(slot) ){
						//if(!player.equiped[slot]) itemName = 'nothing'; else itemName = player.equiped[slot].name;
						itemName = player.equiped[slot].name;
						playerdisplay.showText(slot.toUpperCase() + ": " + itemName, true);
					}
				}
				

				//add in rest of stats once I have them
			}

			//save game from terminal
			function cmdSave(words){
				game.save();
				player.save();
				display.showText("Saving...");
			}

			//delete save game from terminal - this is only temporary
			function cmdDelete(words){
				window.localStorage.removeItem('player');
				window.localStorage.removeItem(application);
				display.showText("Deleting save data...");
			}

			//ERROR - displays a simple error message
			function cmdError(words){
				//display.showText(' ');
				if(words) display.showText(words); else display.showText('Hmmm?');
			}

		//Initialize the canvas, display, and game
		function init(){

			//create a new canvas
			// this is required to initialize the other objects as they must take it as a paramater
			canvas = new Canvas(1200, 600, 'canvas');

			//Creates terminal object for inputing text and displaying the text input
			terminal = new Terminal(
				{
					x:0,   //sets x position where terminal display starts
					y:500,   //sets y position where terminal display starts
					width:canvas.canvas.width,    //sets how wide the terminal display is
					height:100,  //sets how far down the terminal display goes  (if I subtract more than 50ish from this or set it to too small a number, then I get error!)
					background:'#517F51'              //sets background color: can give word, rgb string, or hex
				},
				{
					color:'white',                   //sets font color
					size: 20,                        //sets font size
					style: 'cursive'               //sets font type (!!!kep it a monospace font type or cursor may not track so well)
				},
				canvas                               //reference to canvas object that the terminal appears on.
			);

			
			playerdisplay = new Display(
				{
					x:0,
					y:0,
					width:canvas.canvas.width,
					height:canvas.canvas.height - 100,
					background: 'black'
				},
				{
					color:'white',
					size: 20,
					style: 'cursive'
				},
				canvas

			);
			

			//create a new display
			display = new Display(
				{
					x:0,
					y:0,
					width:canvas.canvas.width,
					height:canvas.canvas.height - 100,
					background: 'black'
				},
				{
					color:'white',
					size: 20,
					style: 'cursive'
				},
				canvas

			);

			//Start Terminal & draw initial text
			//terminal.init();
			 //should call this from terminal.init
			//start player stats display
			playerdisplay.init();
			//start display
			//display.init();

			//load in some map data.  will take an argument allow game to choose map
			loadGame();

			//The following is for testing purpose only.  Get ride of this once we are able to laod in text from data files
			game.here.show(display, "You find yourself in ");

			//Start the game by calling main()
			main(); 
		}

		function loadGame(){
			//for now, just load the first game
			
			if(window.localStorage.getItem(application)){
				console.log('loading saved data...');

				player = new Player(JSON.parse(window.localStorage.getItem('player')));
				var jsonDataGame = JSON.parse(window.localStorage.getItem(application));
				game = new Adventure(jsonDataGame);
				game.setHere(jsonDataGame.here.id);
				

			}
			else{
				player = new Player({
										fullname: "Carl The Destroyer",
										sex:'Male',   
										age: 26,
										baseAttack: 50,
										baseDefense: 50,
										baseHealth:	50,
										baseArmor: 0,
										inventory: [],
										equiped: {
											head:{id:'metalhelm1', name: "Old Metal Helm", type:'armor', detail: "a simple metal helm.", slot:'head', armor: 2, defense: 0, weight: 1, value: 5},
											neck:{id:'empty', name:'None'},
											chest:{id:'lthrjrk', name: "Leather Jerkin", type:'armor', detail: "a leather jerkin.", slot:'chest', armor: 8, defense: -5, weight: 15, value: 20},
											lfinger:{id:'empty', name:'None'},
											rfinger:{id:'empty', name:'None'},
											rhand:{id:'woodclub', name: "Wood Club", type:'weapon', detail: " a wood club with a few knicks in it.", slot:'rhand', damage: 10, weight: 5, value: 1},
											lhand:{id:'empty', name:'None'},
											feet:{id:'wornlthrboots', name: "Worn Leather Boots", type: 'armor', detail: " some old leather boots.", slot:'feet', armor: 2, defense: 0, weight: 1, value: 5}
										},
										attack:	 	50,
										defense: 	50,
										health: 	50,
										armor:		12
									}); 
				game = new Adventure(games[0]);  //can give a second argument giving starting room or set it by setting here property	
			}
			
			
			console.log("loading...", game.title, "by", game.author);
			console.log(game.detail);
			console.log("first room is:", game.rooms[0].name);
		
		}


	}

	var main = gameEngine();

	return main;

}());
