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
//##################################################################################################################################################################################

//Object constructor for a room wrapper.  Includes some utility functions
function Map(data, start){
	if(start) this.here = start; else this.here = data.rooms[0];

	this.title = data.title;
	this.author = data.author;
	this.detail = data.detail;

	this.rooms = data.rooms;
	this.items = data.items;
	this.actors = data.actors;
	this.dialog = data.dialog;	
};

//Set up Terminal object constructor to inheriet methods from Display
Map.prototype = Object.create(Object.prototype); 
//Room.prototype.constructor = Room;  //gives it correct constructor method

//Returns a room object basedon name
Map.prototype.getRoomByID = function(id){
	this.rooms.forEach(function(room, rIndex){
		if(room.id == id){
			return room;
		}
	} );

};





//##################################################################################################################################################################################
// GAME FILE - wrap game declaration in a self executing function to create a closure for a private name space.  declare each game file like this
//##################################################################################################################################################################################

var Test = ( function(){

	//ACTORS
	var ralph = {id:"ralph", name:"Ralph"};
	var bob = {id:"bob", name:"Bob"};

	//ITEMS
	var goldKey = {id:"gkey", name:"Gold key"};

	//ROOMS
	var room1 = {id:"room1", name:"Troll Room"};
	room1.detail = "a large room surrounded on all sides by water. To the north is an exit. You see two trolls standing in your way. What do you do?";
	room1.exits = [{name:"north", link:"room2", detail:""}];
	room1.items = [goldKey] ;
	room1.actors = [ralph];


	var room2 = {id:"room2", name:"Dark Cave", exits:[{"name":"south", "link":"room1", "detail":""}] };
	room2.items = [];
	room2.actors = [bob];
	room2.detail = "You enter a small, dark cave.  A chill wind blows in from above...";

	var game = {
					"title": "TEST!",
					"author": "Lord Niah",
					"detail": "A very testy kind of test game!",
					"rooms":[room1, room2],
					"items":[],    //has an name, description, type, sub-type, (if weaon, then dmg, attack, and other stats), -- can be in room, in another item(container type), or on an actor or the player
					"actors":[],  //
					"dialog":[]
				}

	return game;

} )();


//################################################################################################################################################################################

var games = [Test];  //This holds the variable names referencing each game json file.


//################################################################################################################################################################################



