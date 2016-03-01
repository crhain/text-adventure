/* 
############################################################################################################################################################################################
############################################################################################################################################################################################

	To Do:
	
	
    Overview:
			- game-data.js (holds games global array and HoH game data)
			- various game data files for each game
			- game-display.js  holds constructors for various game display elements
			- game-engine.js   holds main game logic and starts the whole thing rolling

	Notes:
		- 
		- game data will be stored as json files in the game-data.js file for now. 
		- new games can be added by 1) creating a new script file with the json literals and
		  2) adding the variable name of the json to the games array and 3) adding line to
		  index.html to load the file
		- save data will be placed in localStorage
		- a games global array will hold the names of all json game files to be loaded		

###############################################################################################################################################################################################	  
*/

//create a new canvas
// this is required to initialize the other objects as they must take it as a paramater
var canvas = new Canvas(1200, 600, 'canvas');


//Creates terminal object for inputing text and displaying the text input
var terminal = new Terminal(
	{
		x:0,   //sets x position where terminal display starts
		y:500,   //sets y position where terminal display starts
		width:canvas.canvas.width,    //sets how wide the terminal display is
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
terminal.drawText(terminal.keyBuffer); //should call this from terminal.init

var display = new Display(
	{
		x:0,
		y:0,
		width:canvas.canvas.width,
		height:canvas.canvas.height - 100,
		background: 'black'
	},
	{
		color:'white',
		size: 26,
		style: 'cursive'
	},
	canvas

);

display.init();
//display.showText("You walk into a large room surrounded on all sides by water. To the north is an exit. You see two trolls standing in your way. What do you do?");



var game = ( function(global){

	var running = true;

	init();  //Starts the game

	

	//main game loop
	function main(){
		var index = 0;


		///!!! I need to setup animation frames and draw terminal within those frames inside the main loop and then call the mainloop again
		// and again inside the animation frame.  
		//If I just try to draw the canvas and then run this while loop, it draws the canvas and then erases it. Not showing anything!
		//Use frogger game as a template!
		while(running){
			/*
			if(index > 10000)
				running = false;
			*/
			console.log('running... terminal width:', terminal.display.width, "display width:", display.display.width);
			if(terminal.commands){

				commandInterpreter(commands.pop().slice(2))	
				console.log("accepting command!");
			}
			
			index++;


		}
		/*
			1. draw display text
			2. get current command and send to interpreter
			3. animation loop calling main (or just inside while loop for now)
		*/
	}

	//Initialize the canvas, display, and game
	function init(){

		/*
			
		*/

		main(); //Starts main loop
	}

	//core game logic here. Gets command text, parces it, and then runs various commands
	function commandInterpreter(commandText){
		if(commandText.toLowerCase() == 'exit')
			running = false;
			display.showText('Quiting...');
	}


	//handels moving between scenes (only one scene right now)
	//  instead of a function, we could create objects representing scenes and store them
	//  inside of a sceneManager object...
	function sceneManager(){

	}



} )(this);





