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
import {getMatchedItemInList, removeMatchedItemInList, getMatchedItemInObject} from "../helper-functions";
import {Item, Armor, Weapon, Container} from "game-items";
import { Actor } from "game-actors";

var store = {"id":"room2", "name":"Neat", "detail": "really neato, right?"};
var strStore = JSON.stringify(store);

export const Adventure = function (data){

	//sets starting location to start.  If no start argument given, then set to first room
	

	//wrap game object elements
	this.title = data.title;
	this.author = data.author;
	this.detail = data.detail;
	this.rooms = [];

	
	//Get rooms
	for(var r = 0; r < data.rooms.length; r++){
		this.rooms.push(new Room(data.rooms[r]));
	}
	
	var startRoom = this.getRoomByID(data.start);
	if(startRoom){
		this.here = startRoom;	
	}
	else{
		//this returns last room in array for some reason?  But array is in right order... so.
		this.here = this.rooms[0];
	}
	
	
	//if(start) this.here = start; else this.here = data.rooms[0];

	//this.items = data.items;
	//this.actors = data.actors;
	//this.dialog = data.dialog;

};

//Set up Terminal object constructor to inheriet methods from Display
Adventure.prototype = Object.create(Object.prototype); 
//Room.prototype.constructor = Room;  //gives it correct constructor method

Adventure.prototype.init = function(rooms){
	

}

//creates save file for adventure data
//you cannot save objects on localStorage, so we must convert all objects to json strings using JSON.stringify(data);
//and then when loading we must convert back to an object using JSON.parse(jsonstring);
Adventure.prototype.save = function(){
	//window.localStorage.setItem(application, this.here.id);
	//if(window.localStorage.getItem(application)){
	//	window.localStorage.removeItem(application);
	//}
	

	//I need go through all rooms, reading out all their properties that are not methods
	var jsonData = JSON.stringify(this);
		
	window.localStorage.setItem(application, jsonData);
	
	//window.localStorage[application].data = this;  //see if this works
};

Adventure.prototype.clearSave = function(){
	window.localStorage.removeItem(application);
};





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


export const Room = function(data) {
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
		console.log('creating ', this.actors[a].name);
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
			else if(data.items[i].type == 'container'){
				this.items.push(new Container(data.items[i]));
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


//Show room description and contents
Room.prototype.show = function(display, intro){
	var text = "";
		if(intro) 	text = intro;

		display.clear(); //clear the buffer first to make it  pretty
		//show room description
		display.showText(text + this.detail);
		//show item descriptions
		if(this.items){
			this.items.forEach(function(item){
				display.showText("You see " + item.detail);
			} );	
		}
		
		//show actors
		if(this.actors){
			this.actors.forEach(function(actor){
				display.showText(actor.name + " is here.");
			} );
		}
}

Room.prototype.removeItem = function(item){
	//find item in rooms list of items
	for(var i = 0; i < this.items.length; i++){
		if(item.id == this.items[i].id){
			this.items.splice(i, 1);
		}
	}
	
}
