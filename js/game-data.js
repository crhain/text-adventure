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

//Note: do not give player attribute names that are the same as item attribute names or the addItemStats and removeItemStats methods will not work correctly.
function Player(data){
	//data is an object with the player data (either passed or object literal)


	this.fullname = 	data.fullname;
	this.sex = 			'Male';   //set it from character creation once that feature implimented
	this.age = 			26;
	//this.physical = 		data.physical;
	//this.bio =			data.bio
	this.baseAttack =			50;
	this.baseDefense =			50;
	this.baseHealth	=			50;
	this.baseArmor =			0;

	
	this.inventory = [];  //list of item objects
	//The following are set to objects representing the items the player has equped
	this.equiped ={
		head:{id:'metalhelm1', name: "Old Metal Helm", detail: "a simple metal helm.", slot:'head', armor: 2, defense: 0, weight: 1, value: 5},
		neck:undefined,
		chest:{id:'lthrjrk', name: "Leather Jerkin", detail: "a leather jerkin.", slot:'chest', armor: 8, defense: -5, weight: 15, value: 20},
		lfinger:undefined,
		rfinger:undefined,
		rhand:{id:'woodclub', name: "wood club", detail: " a wood club with a few knicks in it.", slot:'rhand', damage: 10, weight: 5, value: 1},
		lhand:undefined,
		feet:{id:'wornlthrboots', name: "Worn Leather Boots", detail: " some old leather boots.", slot:'feet', armor: 2, defense: 0, weight: 1, value: 5}
	};

	this.attack =				50;
	this.defense = 				50;
	this.health =				50;
	this.armor =				12;

	
	this.dead = false;
}

Player.prototype = Object.create(Object.prototype);



//Takes an object representing an item and adds to players inventory
Player.prototype.addItemToInventory = function(item){
	//may have to add some code to check for duplicates or
	//allow for stacking of items
	this.inventory.push(item);
}; 

//Takes an object representing an item and removes from players inventory if it is present. If it is not, returns false
Player.prototype.removeItemFromInventory = function(item){
	//may add some code to allow subtracting from stacks
	var success = false;
	//loop through inventory looking for item
	for(var i = 0; i < this.inventory.length; i++){
		if(this.inventory[i].id == item.id){
			success = true;
			console.log("deleting", item.name, "at index", i, "from inventory.")
			this.inventory.splice(i, 1); //delete the item from inventory if matched
			console.log("inventory is now:", this.inventory);
		}
	}

	return success;
};

//experimental
Player.prototype.getItemInInventory = function(words){
	return getMatchedItemInList(words, this.inventory, 'name');
};




Player.prototype.equipItem = function(item, slot){

	var success = false;

	if(this.removeItemFromInventory(item)){ //remove item from inventory and continue if succesfull

		if(this.equiped[slot]){  //if something is in the equiped slot...			
			this.unequipItem(this.equiped[slot], slot);	 //unequip that item (putting it in inventory)
		}
		this.equiped[slot] = item;  //I have to use bracket notation instead of dot notation when using a string name for an object property!
		this.addItemStats(item); //update Player stats based on item added
		success = true;
	}
	
	return success;	

};

Player.prototype.unequipItem = function(item, slot){

	//console.log('I am unequiping', item.name, "from my", slot, "slot");
	this.addItemToInventory(item);
	this.removeItemStats(item);
	this.equiped[slot] = undefined;
	

	return true;
};

//This will remove stats for items when player unequips them
Player.prototype.removeItemStats = function(item){
	for(stat in this){
		if(this.hasOwnProperty(stat)){
			if(stat in item){
				this[stat] -= item[stat]
			}
		}
	}
}

//This will add stats for items when player equips them
Player.prototype.addItemStats = function(item){
	for(stat in this){
		if(this.hasOwnProperty(stat)){
			if(stat in item){
				this[stat] += item[stat]
			}
		}
	}
}



//ACTOR - object that wraps actors
function Actor(data){
	this.isHostile;
};

Actor.prototype = Object.create(Player.prototype);
Actor.prototype.constructor = Actor;  //gives it correct constructor method

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
//Constructor for a basic item
function Item(data){
	this.id = 					data.id;
	this.name = 				data.name;
	this.detail_placed =		data.detail_placed;   //this represents the description of the item the first time it is viewed
	this.detail_dropped =		data.detail_dropped  //this represents the description of the item when it is dropped
	this.detail =				data.detail;         //this is the item detail when player looks at the item
	this.value =				data.value;          //value in 
	this.weight =				data.weight;

}

Item.prototype = Object.create(Object.prototype); 

//Object constructor for a room wrapper.  Includes some utility functions
function Map(data, start){

	//sets starting location to start.  If no start argument given, then set to first room
	if(start) this.here = start; else this.here = data.rooms[0];

	//wrap game object elements
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
Map.prototype.setHere = function(roomID){
	//console.log("setting here to id:", roomID);
	var temp = this.getRoomByID(roomID);
	//console.log("this is the room obj:", temp)
	this.here = temp;
	//console.log("here is now equal to:", this.here);
}





//##################################################################################################################################################################################
// GAME FILE - wrap game declaration in a self executing function to create a closure for a private name space.  declare each game file like this
//##################################################################################################################################################################################

var Test = ( function(){

	//ACTORS
	var ralph = {id:"ralph", name:"Ralph", detail:"a short, hairy humanoid with a toothless grin plastered on it's face."};
	var bob = {id:"bob", name:"Bob", detail:"a large troll with a pot belly."};

	//ITEMS
	var goldKey = {id:"gkey", name:"gold key", detail:"a large, gleaming [gold key] laying on top of an old barrel."};   //hidden property that only reveals on examine or search
	var rustySword = {id:"rustysword1", name:"Rusty Sword", slot:'rhand', damage:20, detail:"a [rusty sword] laying on the floor next to the barrel."};   //hidden property that only reveals on examine or search

	//ROOMS
	var room1 = {id:"room1", name:"Troll Room"};
	room1.detail = "a large room surrounded on all sides by water. To the [north] is an exit.  A [rope] dangles down from above";
	room1.exits = [{name:"north", link:"room2", detail:""}, {name:"rope", link:"room3", detail:""}];
	room1.items = [goldKey, rustySword];
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



