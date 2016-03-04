/* 
############################################################################################################################################################################################
############################################################################################################################################################################################

	To Do:

		- create player object
		- basic move command
		- basic look command


	Revision: 
			

    Overview:
			- game-data.js (holds games global array and HoH game data)
			- various game data files for each game
			- terminal-app.js  holds constructors for various game display elements
			- game-engine.js   holds main game logic and starts the whole thing rolling

	Notes:
		- when a room is loaded as location, any items or mobs present are also read in and created as objects.
		- maybe add ability for monsters to move between rooms, in which case they must be removed from the current room.
		- game data will be stored as json files in the game-data.js file for now. 
		- new games can be added by 1) creating a new script file with the json literals and
		  2) adding the variable name of the json to the games array and 3) adding line to
		  index.html to load the file
		- save data will be placed in localStorage
		- a games global array will hold the names of all json game files to be loaded		

###############################################################################################################################################################################################	  
*/


var gameEngine = ( function(global){

	var game = "";      //holds data for current game
	
	var running = true;  //if true, then contiue to run the game
	var location = {};  //game data for current location of player
	

	init();  //Starts the game

	//main game loop
	function main(){
		//calculate animation delay factor by comparing timeStamps - only for if we want animations

		//Get scene - add this at latter point
		
		//get command and send to interpreter - is is the core of the game
		if(terminal.commands.length > 0){
			var cmdText = terminal.commands.shift();
			commandInterpreter(cmdText);	
		}
		
		//request a new animation frame and rerun main() - this goes last in main
		if(running){
			console.log("?");
			window.requestAnimationFrame(main);	
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
			command: ['say'],
			handler: cmdSay
		},
		{
			command: ['move', 'go', 'walk', 'head'],
			handler: cmdMove
		}
	];
											
	
	//core game logic here. Gets command text, parces it, and then runs various commands
	function commandInterpreter(cmdText){

		var cmdExe = undefined;  //holds the command handler to be executed
		var cmdTokens = [];      //list of command tokens created from cmdText
		var args = [];            //this contains non-command tokens that are passed to the command function as arguments
		var cmdMatched = false;   //this is a hack so that I know that a cmdToken is not a command and can be pushed ot arguments list

		
		var reTokens = /".+"|[^ .]+/gi;  //regular expression that finds words or "strings" in the command string (could add ' ' as well)
		

		//1. use an re to extract all strings or words into cmdTokens list.
		cmdTokens = cmdText.match(reTokens);

		//2. go through cmdTokens list and see if they are in the commands list
		cmdTokens.forEach(function(tValue, tIndex){
			
			cmdMatched = false;

			commands.forEach(function(cValue, cIndex){
				//3. if a cmdToken is in the commands list, then add its handler to cmdExe
				if(cValue.command.length == 1){
					if(tValue.toLowerCase() == cValue.command[0]){
						cmdExe = cValue.handler;
						cmdMatched = true;
					}
				}		
				else{
					//3. if a cmdToken is in the commands list, then add its handler to cmdExe
					for(var i = 0; i<cValue.command.length; i++){
						if(tValue.toLowerCase() == cValue.command[i]){
							//console.log(cValue.command[i]);
							cmdExe = cValue.handler;
							cmdMatched = true;
						}
					}		
				}				
			} );
			
			//If this cmdToken is not a command, then push it to the args list
			if(!cmdMatched){
					args.push(tValue);
					console.log("pushing", tValue);
				}
	
		} );

		//if no command was found, then call cmdError
		if(cmdExe) cmdExe(args); else cmdError(args);
				
		//!!!I was going to allow stringing of commands by pushing command token to an array, but that would be just too complex right now		
	}


	//################################################################################
	//COMMAND handlers
	//--------------------------------------------------------------------------------

		//QUIT - exit the game
		function cmdQuit(args)
		{
			running = false;
			display.showText(' ');
			display.showText('Quiting...');
		}

		//SAY - say whatever words came after the command
		function cmdSay(args){
			//if there is only one arg, then say that
			if(args){
				if(args.length == 1){
					display.showText(' ');
					display.showText('You say: ' + args);
				}
				else if(args.length > 1){
					display.showText(' ');
					display.showText('You say: ' + args.join(" ") );
				}
			}
			else{
				display.showText(' ');
				display.showText('You say nothing!');
			}
			
		}

		//MOVE - takes the name of a door and will move player to connecting room
		function cmdMove(args)
		{
			console.log("I am moving!");
		}

		//ERROR - displays a simple error message
		function cmdError(args){
			display.showText(' ');
			display.showText('Hmmm?');
		}



	//handels moving between scenes (only one scene right now)
	//  instead of a function, we could create objects representing scenes and store them
	//  inside of a sceneManager object...
	function sceneManager(){

	}

	//Initialize the canvas, display, and game
	function init(){

		//create a new canvas
		// this is required to initialize the other objects as they must take it as a paramater
		global.canvas = new Canvas(1200, 600, 'canvas');

		//Creates terminal object for inputing text and displaying the text input
		global.terminal = new Terminal(
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

		//create a new display
		global.display = new Display(
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

		//Start Terminal & draw initial text
		terminal.init();
		terminal.drawText(terminal.keyBuffer); //should call this from terminal.init
		//start display
		display.init();

		//load in some game data
		loadGame();

		//The following is for testing purpose only.  Get ride of this once we are able to laod in text from data files
		display.showText("You walk into a large room surrounded on all sides by water. To the north is an exit. You see two trolls standing in your way. What do you do?");

		//Start the game by calling main()
		main(); 
	}

	function loadGame(){
		//for now, just load the first game
		game = games[0];
		console.log("loading...", game.title, "by", game.author);
		console.log(game.detail);
		console.log("first room is:", game.rooms[0].name);
		
	}





} )(this);  //sending this to wraper function so the global namespace gets assigned to the variable name global.





