/* 
############################################################################################################################################################################################
############################################################################################################################################################################################
GAME-ACTORS.JS
============================================================================================================================================================================================
Overview: contains objects defining any actor in the game, including player, friendlies, and hostiles.
============================================================================================================================================================================================		

###############################################################################################################################################################################################	  
*/
//Note: do not give player attribute names that are the same as item attribute names or the addItemStats and removeItemStats methods will not work correctly.


/*
//############################################################################################################################################
PLAYER OBJECT CONSTRUCTOR FUNCTION
============================================================================================================================================
OVERVIEW: contains basic properties for displaying text

	INPUTS:  data : an object literal that contains all data needed to create a player object

	OUTPUTS: returns a player object
#############################################################################################################################################
*/
import {getMatchedItemInList, removeMatchedItemInList, getMatchedItemInObject} from "helper-functions";

export const Player = function (data){
	//data is an object with the player data (either passed or object literal)


	this.fullname = 	data.fullname;
	this.sex = 			data.sex;   //set it from character creation once that feature implimented
	this.age = 			data.age;
	//this.physical = 		data.physical;
	//this.bio =			data.bio
	this.baseAttack =			data.baseAttack;
	this.baseDefense =			data.baseDefense;
	this.baseHealth	=			data.baseHealth;
	this.baseArmor =			data.baseArmor;

	
	this.inventory = 			data.inventory;  //list of item objects
	//The following are set to objects representing the items the player has equped

	//	head:{id:'metalhelm1', name: "Old Metal Helm", type:'armor', detail: "a simple metal helm.", slot:'head', armor: 2, defense: 0, weight: 1, value: 5},
	//	neck:undefined,
//		chest:{id:'lthrjrk', name: "Leather Jerkin", type:'armor', detail: "a leather jerkin.", slot:'chest', armor: 8, defense: -5, weight: 15, value: 20},
//		lfinger:undefined,
//		rfinger:undefined,
//		rhand:{id:'woodclub', name: "wood club", type:'weapon', detail: " a wood club with a few knicks in it.", slot:'rhand', damage: 10, weight: 5, value: 1},
//		lhand:undefined,
//		feet:{id:'wornlthrboots', name: "Worn Leather Boots", type: 'armor', detail: " some old leather boots.", slot:'feet', armor: 2, defense: 0, weight: 1, value: 5}
	
	this.equiped = 				data.equiped;

	this.attack =				data.attack;
	this.defense = 				data.defense;
	this.health =				data.health;
	this.armor =				data.armor;

	
	this.dead = false;
}

Player.prototype = Object.create(Object.prototype);


//=============================================================================================================================================================================
//                   PUBLIC METHODS
//=============================================================================================================================================================================


//===========================================================================================
//EQUIP ITEM METHOD - removes item from intenvory and adds it an equipment slot
//===========================================================================================



//===========================================================================================
//EQUIP ITEM METHOD - removes item from intenvory and adds it an equipment slot
//===========================================================================================
Player.prototype.equipItem = function(item, slot){

	var success = false;

	if(this.removeItemFromInventory(item)){ //remove item from inventory and continue if succesfull

		if(this.equiped[slot] && this.equiped[slot].id != 'empty'){  //if something is in the equiped slot other than 'empty' item			
			
			this.unequipItem(this.equiped[slot], slot);	 //unequip that item (putting it in inventory)	
						
		}
		this.equiped[slot] = item;  //I have to use bracket notation instead of dot notation when using a string name for an object property!
		this.addItemStats(item); //update Player stats based on item added
		success = true;
	}
	
	return success;	

};

//===========================================================================================
//UNEQUIP ITEM METHOD - removes item from slot and places into inventory
//===========================================================================================
Player.prototype.unequipItem = function(item, slot){

	if(item.id == 'empty'){ //if empty empty equiped then it cannot be unequiped

		return false;
	}
	else{
		this.addItemToInventory(item);
		this.removeItemStats(item);
		this.equiped[slot] = {id:'empty', name:'None'}; //this is the empty object - it cannot be unequiped for obvious resons	
	}
	
	return true;
};


//===========================================================================================
//SAVE METHOD - saves player data to local storage
//===========================================================================================
Player.prototype.save = function(){
	//window.localStorage.setItem(application, this.here.id);
	//if(window.localStorage.getItem(application)){
	//	window.localStorage.removeItem(application);
	//}	
	//I need go through all rooms, reading out all their properties that are not methods
	var jsonData = JSON.stringify(this);
		
	window.localStorage.setItem('player', jsonData);
	
	//window.localStorage[application].data = this;  //see if this works
};


//===========================================================================================
//CLEAR SAVE METHOD - removes saved player data from localStorage
//===========================================================================================
Player.prototype.clearSave = function(){
	window.localStorage.removeItem('player');
};





//=============================================================================================================================================================================
//                   PRIVATE METHODS
//=============================================================================================================================================================================


//===========================================================================================
//ADD ITEM TO INVENTORY METHOD - adds item to players inventory
//===========================================================================================
Player.prototype.addItemToInventory = function(item){
	//may have to add some code to check for duplicates or
	//allow for stacking of items
	this.inventory.push(item);
}; 


//===========================================================================================
//REMOVE ITEM FROM INVENTORY METHOD - removes an item from players inventory
//===========================================================================================
Player.prototype.removeItemFromInventory = function(item){
	//may add some code to allow subtracting from stacks
	var success = false;
	//loop through inventory looking for item
	for(var i = 0; i < this.inventory.length; i++){
		if(this.inventory[i].id == item.id){
			success = true;
			//console.log("deleting", item.name, "at index", i, "from inventory.")
			this.inventory.splice(i, 1); //delete the item from inventory if matched
			//console.log("inventory is now:", this.inventory);
		}
	}

	return success;
};

//experimental
Player.prototype.getItemInInventory = function(words){
	return getMatchedItemInList(words, this.inventory, 'name');
};

//===========================================================================================
//REMOVE ITEM STATS - removes item stats from player (used when an item is unequiped)
//===========================================================================================
Player.prototype.removeItemStats = function(item){
	for(stat in this){
		if(this.hasOwnProperty(stat)){
			if(stat in item){
				this[stat] -= item[stat]
			}
		}
	}
}

//===========================================================================================
//ADD ITEM STATS - adds item stats  (used when an item is equiped)
//===========================================================================================
Player.prototype.addItemStats = function(item){
	for(stat in this){
		if(this.hasOwnProperty(stat)){
			if(stat in item){
				this[stat] += item[stat]
			}
		}
	}
}


/*
//############################################################################################################################################
ACTOR OBJECT CONSTRUCTOR FUNCTION (based on Player object)
============================================================================================================================================
OVERVIEW: object constructor for an actor object. Actors represent any mobile character in the game, including enemies, friendlies, and 
merchtants.

	INPUTS:  data : an object literal that contains all data needed to create an actor object

	OUTPUTS: returns an Actor object
#############################################################################################################################################
*/
export const Actor= function(data){

	//Player.call(this, data);  //currently the player uses fullName property and actors use name properties

	this.id = data.id;
	this.name = data.name;
	this.detail = data.detail;
	this.hostile;
};

Actor.prototype = Object.create(Player.prototype);
Actor.prototype.constructor = Actor;  //gives it correct constructor method

//Show actors detailed description
Actor.prototype.show = function(display, intro){
	var text = "";
		if(intro) 	text = intro;

		//show room description
		display.showText(text + this.detail);		
}