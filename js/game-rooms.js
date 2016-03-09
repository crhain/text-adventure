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

/*
//############################################################################################################################################
ADVENTURE OBJECT CONSTRUCTOR FUNCTION
============================================================================================================================================
OVERVIEW: object constructor for an Adventure.  This contains room objects representing the adventure area. 

	INPUTS:  
		data : an object literal that contains all the adventure data in json or javascript object format.
		start: ???  need to work on this

	OUTPUTS: returns an Adventure object
#############################################################################################################################################
*/
function Adventure(data, start){

	//sets starting location to start.  If no start argument given, then set to first room
	if(start) this.here = start; else this.here = data.rooms[0];

	//wrap game object elements
	this.title = data.title;
	this.author = data.author;
	this.detail = data.detail;
	this.rooms = [];

	//Get rooms
	for(var r = 0; r < data.rooms.length; r++){
		this.rooms.push(new Room(data.rooms[r]));
	}
	
	//this.items = data.items;
	//this.actors = data.actors;
	//this.dialog = data.dialog;



};

//Set up Terminal object constructor to inheriet methods from Display
Adventure.prototype = Object.create(Object.prototype); 
//Room.prototype.constructor = Room;  //gives it correct constructor method

Adventure.prototype.init = function(rooms){
	

}



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


function Room(data){
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