/* 
############################################################################################################################################################################################
############################################################################################################################################################################################

	To Do:

	Revision: 
			I need to call main inside of animation loop 
			I need to call a drawDisplay and drawTerminal method (which need to be created) that draws the display and terminal every animation frame
			I will probably need to remove line breaking for non-carriage returned lines from terminal or at least limit continuous lines involved
			I will have to format keybuffer and push to display buffer for display similar to the way I am doing it for display

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

var running = true;


var game = ( function(global){

	var mainID;
	var playerLoc = "";  //current location of player
	

	init();  //Starts the game

	

	//main game loop
	function main(){
		//calculate animation delay factor by comparing timeStamps

		//Get scene - add this at latter point

		//draw game output
		//get command and send to interpreter
		if(terminal.commands.length > 0){
			var cmdText = terminal.commands.pop();
			commandInterpreter(cmdText);	
		}
		
		
		//request a new animation frame and rerun main()
		if(running){
			//console.log("?");
			mainID = window.requestAnimationFrame(main);	
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

		display.init();
		display.showText("You walk into a large room surrounded on all sides by water. To the north is an exit. You see two trolls standing in your way. What do you do?");


		main(); //Starts main loop
	}


		//################################################################################
		//COMMANDS LISTING - shows commands game understands
		//--------------------------------------------------------------------------------		
		var commands = [
			{
				command: ['quit'],
				callback: cmdQuit
			},
			{
				command: ['say'],
				callback: cmdSay
			},
			{
				command: ['move', 'go', 'walk', 'head'],
				callback: cmdMove
			}
		];
											
	
	//core game logic here. Gets command text, parces it, and then runs various commands
	function commandInterpreter(cmdText){

		var cmdExe = [];  //passes an object {cmd: , arguments:[]}
		var cmdTokens;    
		//console.log(commandText);

		//1. use an re extract all strings or words into cmdTokens list.


		//2. go through cmdTokens list and see if they are in the commands list
		commands.forEach(function(){
			//3. if a cmdToken is in the commands list, then add its callback to cmdExe
			//and add all words that follow to the cmdArgs list
	
		} );

		//4. if cmdExe then run through it and execute all commands with arguments; if not, return error


		//#############################################################################################
		//TEST CODE
		//---------------------------------------------------------------------------------------------

		if(cmdText.toLowerCase() == 'quit'){
			cmdQuit();	
		}
	
			

			//cannot set global variable running from inside this function?????
			//return a false value and set running in main function
			//return false;  
	}


	//################################################################################
	//COMMAND CALLBACKS
	//--------------------------------------------------------------------------------

		//Exit Game
		function cmdQuit(args)
		{
			running = false;
			display.showText('Quiting...');
		}


		function cmdSay(args){
			//if there is only one arg, then say that
			if(args){
				if(args.length == 1){
					display.showText('You say: "' + args + '"');
				}
				else{
					display.showText('You say: "' + args.join(" ") + '"');
				}
			}
			else{
				display.showText('You say nothing!');
			}
			
		}

		function cmdMove(args)
		{

		}


	//handels moving between scenes (only one scene right now)
	//  instead of a function, we could create objects representing scenes and store them
	//  inside of a sceneManager object...
	function sceneManager(){

	}



} )(this);





