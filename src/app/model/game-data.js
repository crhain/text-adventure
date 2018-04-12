/* 
############################################################################################################################################################################################
############################################################################################################################################################################################

	To Do:
	
	
    Overview:
			- game-data.js (holds games global array and HoH game data)
			- various game data files for each game
			

	Notes:
		- I could define common 
		- game data will be stored as json files in the game-data.js file for now. 
		- new games can be added by 1) creating a new script file with the json literals and
		  2) adding the variable name of the json to the games array and 3) adding line to
		  index.html to load the file
		- save data will be placed in localStorage
		- a games global array will hold the names of all json game files to be loaded		
		- because the game data files are so massive, I might want to create a parser tool (either node.js or python) that:
		   - parses text from multiple files
		   - parses text written in a more user-friendly style with xml like tags?
		   - writes output to a text file in json format.  This can then be saved as a game-data.js file and loaded into index.html

###############################################################################################################################################################################################	  
*/


//DEFINE ALL GAME DATA FILES HERE
/*
var HoH = {
	"rooms": [
				"id":"",
				"name": "",
				"detail": "",
				"items": ["id1", "id2"],
				"actors": ["id1", "id2"],
				"exits":[
					"id":"",
					"name":"",
					"link":""
				]
			],
	"items": [],
	"actors": [],
	"dialog": []
};
*/

//##################################################################################################################################################################################
// WRAPER OBJECT CONSTRUCTORS - utility objects for defining various game objects
//   all objects here deal with the game model only.  Any object that would deal directly with game logic or interacting with the view would go in game-engine.js
//   these provide wrapers for game data and utility methods to retrieve and set data on those objects
//##################################################################################################################################################################################

var application = 'textAdventure';

//##################################################################################################################################################################################
// GAME FILE - wrap game declaration in a self executing function to create a closure for a private name space.  declare each game file like this
//##################################################################################################################################################################################

var Test = ( function(){

	//ACTORS
	var ralph = {id:"ralph", name:"Ralph", detail:"a short, hairy humanoid with a toothless grin plastered on it's face."};
	var bob = {id:"bob", name:"Bob", detail:"a large troll with a pot belly."};

	//ITEMS
	var goldKey = {id:"gkey", name:"gold key", detail:"a large, gleaming [gold key] laying on top of an old barrel."};   //hidden property that only reveals on examine or search
	var rustySword = {id:"rustysword1", type:'weapon', name:"Rusty Sword", slot:'rhand', damage:20, detail:"a [rusty sword] laying on the floor next to the barrel."};   //hidden property that only reveals on examine or search
	var chest = {id:"chest", type:'container', name:"chest", detail:"a firmly constructed chest.", contents:[goldKey]};
	


	//ROOMS
	var room1 = {id:"room1", name:"Troll Room"};
	room1.detail = "a large room surrounded on all sides by water. To the [north] is an exit.  A [rope] dangles down from above";
	room1.exits = [{name:"north", link:"room2", detail:""}, {name:"rope", link:"room3", detail:""}];
	room1.items = [chest, rustySword];
	room1.actors = [ralph];


	var room2 = {id:"room2", name:"Dark Cave", exits:[{"name":"south", "link":"room1", "detail":""}] };
	room2.items = [];
	room2.actors = [bob];
	room2.detail = "a small, dark cave.  A chill wind blows in from above... The only way out is the [south exit]";

	var room3 = {id:"room3", name:"Secret Chamber", exits:[{"name":"hatch", "link":"room1", "detail":""}] };
	room3.items = [];
	room3.actors = [];
	room3.detail = " a small, confined room lighted by a single candel sitting on an unsteady looking table.  The only other thing here is the [hatch] you climbed up through.";

	var game = {
					"title": "TEST!",
					"author": "Lord Niah",
					"detail": "A very testy kind of test game!",
					"start": 'room1',
					"rooms":[room1, room2, room3],
					"items":[],    //has an name, description, type, sub-type, (if weaon, then dmg, attack, and other stats), -- can be in room, in another item(container type), or on an actor or the player
					"actors":[],  //
					"dialog":[]
				}

	return game;

} )();


//################################################################################################################################################################################

var games = [Test];  //This holds the variable names referencing each game json file.


//################################################################################################################################################################################



