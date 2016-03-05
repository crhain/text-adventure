/* 
############################################################################################################################################################################################
############################################################################################################################################################################################

	To Do:

		- create player object
		- udpate move command to use new functions
		- update look command and add examine command
		
		


	Revision: 
			

    Overview:
			- game-data.js (holds games global array and HoH game data)
			- various game data files for each game
			- terminal-app.js  holds constructors for various game display elements
			- game-engine.js   holds main game logic and starts the whole thing rolling

	Notes:
	    - construct room description from bits of text.  for instance, when the character moves, it starts with text "You walk into "
	       then it adds the rooms description "a small, round room with a high ceiling lost in shadows."  this is teh short description.  added to it
	       are the short descriptions for exits, items, and actors.  look command brings up a longer description.  Examine command or search brings up hidden description
	    - when more than one actor of the same type is in the room, game will count them and and translate the number into a number word and use right articles and plurals.
	      example: you see two trolls standing by the door.   
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

	var game;      //holds data for current game
	
	var running = true;  //if true, then contiue to run the game
	//var here = {};  //game data for current location of player. This engine level varialbe is a wraper for the game.here property?
	
	

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
			command: ['say'],
			handler: cmdSay
		},
		{
			command: ['move', 'go', 'walk', 'head'],
			handler: cmdMove
		},
		{
			command: ['look'],
			handler: cmdLook
		},
		{
			command: ['get', 'take'],
			handler: cmdGet
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
					tValue = removeQuotes(tValue);
					args.push(tValue);
					//console.log("pushing", tValue);
				}
	
		} );

		//if no command was found, then call cmdError
		if(cmdExe) cmdExe(args); else cmdError(args);
				
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
		function cmdQuit(args)
		{
			running = false;
			//display.showText(' ');
			display.showText('Quiting...');
		}

		//wraper for display clear method.  clears the screen of text.
		function cmdClear(args){
			display.clear();	
		}

		//SAY - say whatever words came after the command
		function cmdSay(args){
			//if there is only one arg, then say that
			if(args){
				if(args.length == 1){
					//display.showText(' ');
					display.showText('You say: ' + args);
				}
				else if(args.length > 1){
					//display.showText(' ');
					display.showText('You say: ' + args.join(" ") );
				}
			}
			else{
				//display.showText(' ');
				display.showText('You say nothing!');
			}
			
		}

		//MOVE - takes the name of a door and will move player to connecting room
		function cmdMove(args)
		{
			
									
			if(!args){
				cmdError();

			}
			else{

				//If I allow for multi word names, I will have to match multiple arges. Let's just do single names for now

				//1. get exits list
				var destination = undefined;  //destination holds the roomID from exits list
				var hits = [];  //an array that contains a list of possible exit matches
				var exits = game.here.exits;  //wraps exits on current room for ease of typing


				//2. we need a way to match individual args with multiword door names
				//    we could return lists of possible hits (with id) and refine it
				//    by iterating untill we are either through entire list or we get a single match

				//3. compare args with exits
				//Loop through arguments list
				for(var argIndex = 0; argIndex < args.length; argIndex++)
				{
					var word = args[argIndex];
					for(var exIndex = 0; exIndex < exits.length; exIndex++){
						var exName = exits[exIndex].name;
						if(word.toLowerCase() == exName.toLowerCase()){
							destination = exits[exIndex].link;
							break;
						}
					}

					if(destination)	break;					
				}
				

				if(destination){
					game.setHere(destination);
					showCurrentRoom("You enter ");	
				}
				else{
					cmdError(["You want to get where?"])
				}
				//4. a match is found, then change here to new location
				

			}			

		}

		function cmdLook(args){
			showCurrentRoom("You are in ");
		}

		function cmdGet(args){
			//need to write helper function
			//display.showText('Gettin it!');

			var item = removeMatchedItem(args, game.here.items, 'name');
			if(item){
				display.showText("You recieve " + item.name);
				//!!!add item to player inventory once it exists
			}
			else{
				cmdError(["You want to get what?"]);
			}
				
		}

		//ERROR - displays a simple error message
		function cmdError(args){
			//display.showText(' ');
			if(args) display.showText(args); else display.showText('Hmmm?');
		}

	//wraper function for showing room description	- 
	//arguments: intro - optinoal intro text (remember to add space after)
	function showCurrentRoom(intro){
		var text = "";
		if(intro) 	text = intro;
		//show room description
		display.showText(text + game.here.detail);
		//show item descriptions
		if(game.here.items){
			game.here.items.forEach(function(item){
				display.showText("You see " + item.detail);
			} );	
		}
		
		//show actors

		//add section to show monsters in the room
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

		//load in some map data.  will take an argument allow game to choose map
		loadGame();

		//The following is for testing purpose only.  Get ride of this once we are able to laod in text from data files
		cmdLook(game.here.detail);

		//Start the game by calling main()
		main(); 
	}

	function loadGame(){
		//for now, just load the first game
		game = new Map(games[0]);  //can give a second argument giving starting room or set it by setting here property
		console.log("loading...", game.title, "by", game.author);
		console.log(game.detail);
		console.log("first room is:", game.rooms[0].name);
	
	}


	



} )(this);  //sending this to wraper function so the global namespace gets assigned to the variable name global.


/*
 create utility function called smartmatch(search, target) that matches a list of words against another list with multiword strings.
		  it must cumulatively do sub-matches against the target strings untill it has matched one of the target strings completely.
		  It could also do partial matches based on some algorithim and return the best match.  For instance, it would understand abbreviations or mispellings like n or nroth for north

*/

//#####################################################################################################
	//getMatchedItem:
	//-----------------------------------------------------------------------------------------------------
	//  Inputs:
	//		words - a list/array of strings to be searched against
	//      target - a second list to search against words for a match
	//      property(optional) - if list contains objects, then the property to access
	//  Return: the list item that was matched or false if no match
	//#####################################################################################################      
	function getMatchedItem(words, target, property){

		var sentence = words.join(" ").toLowerCase();
		console.log("word list is:", sentence);

		//Now iterate over the target list
		for(var i = 0; i < target.length; i++){
			console.log("my item name is:", target[i][property]);
			if(sentence.search(target[i][property].toLowerCase()) != -1){
				return target[i]; //return the item in the list that matched
			}
		}

		return false;
	}

	function removeMatchedItem(words, target, property){
		var sentence = words.join(" ").toLowerCase();
		var item = undefined;

		//Now iterate over the target list
		for(var i = 0; i < target.length; i++){

			if(sentence.search(target[i][property].toLowerCase()) != -1){
				item = target[i]; //return the item in the list that matched
				target.splice(i, 1);  //removes item from target
			}
		}

		return item;
		
	}


/*
1. I could declare game objects in a new file. objects would be:
  - Player
  	 this.name
  	 this.sex
  	 this.age
  	 this.detail
     this.inventory = []
     this.equiped = {right:{}, left:{}, head:{}} 
     this.maxHealth = ;
     this.maxStrength = ;
     this.maxDexterity = ;
     this.currHealth = ;
     this.currStrength = ;
     this.currDexterity = ;
     this.alive = true;

  - actor
    inheriet from player or maybe other way around
       this.location = ""


  - item

     
commands:

1. look [target]  = look at room (no arguments) or target (actor, item, inventory)
2. examine (target) =  look more closely at something (item, container, self- for status)
2. search [target]  = search room (no arguments) or target (can be a dead body or container)
3. move (exit) = move through an exit
4. take (item)
5. equip (item)
6. unequip (item)
7. attack
8. talk [target] = start a conversation if possible
9. say [string]  = say a string of words
10. emotes      = simply echo what player typed in.  could be used for special interactions

- drop
- put
- give
- disarm (door, container, trap)  if traps are added
- unlock (door, container)
- climb  (special exits)


neat idea:  add tags into detail description that weaves details of an item or monster into the scene.  Could also block out sections that
will appear or disappear depending on various flags.  This would require that the text be parced first before being displayed.


Additional Features:
* markup language for mixing monster and item descriptions into the main room text or showing/hidding parts of description depending on game state
* reactive room descriptions, special events that can occur (first entering, running commands, game state changes)
* 
* actors can follow the player



*/



