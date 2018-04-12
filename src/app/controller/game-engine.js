/* 
#############################################################################################################################################################
#############################################################################################################################################################
#############################################################################################################################################################	  
*/
import {getMatchedItemInList, removeMatchedItemInList, getMatchedItemInObject} from "../helper-functions.js";
import {Canvas, Display, Terminal} from "../view/terminal-app.js";
// import {Item, Armor, Weapon, Container} from "./game-items.js";
import { Player } from "./game-actors.js";
import { Adventure } from "./game-rooms.js";


export default function() {

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

		update();				
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
				//1. get exits list
				var destination = undefined;  //destination holds the roomID from exits list
				var exits = game.here.exits;  //wraps exits on current room for ease of typing


				//2. compare words with exits using helper function
				var match = getMatchedItemInList(words, exits, 'name')

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
			var item = getMatchedItemInObject(words, player.equiped, 'name')

			//2. if found, then remove from slot and add to inventory
			if(item && player.unequipItem(item, item.slot)){				
				display.showText("You unequip " + item.name);	
			}
			else{
				cmdError(["Nothing to unequip!"]);	
			}			
		}


		function cmdOpen(words){
			var item = getMatchedItemInObject(words, game.here.items, 'name')
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

	//update game variables and handel events and monster ai
	function update(){

		//1. loop through list of monsters in current room checking for hostil or dead

		//2. If they are hostil, they will attack player (no complex AI right now)

		//3. If they are dead they do nothing right now, but will be replaced by a corpose item? A container that can be looted

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


}; 




