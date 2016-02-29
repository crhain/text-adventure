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

var game = ( function(global){

	init();  //Starts the game

	

	//main game loop
	function main(){
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

	}


	//handels moving between scenes (only one scene right now)
	//  instead of a function, we could create objects representing scenes and store them
	//  inside of a sceneManager object...
	function sceneManager(){

	}



} )(this);





