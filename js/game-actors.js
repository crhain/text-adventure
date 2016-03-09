/* 
############################################################################################################################################################################################
############################################################################################################################################################################################
GAME-ACTORS.JS
============================================================================================================================================================================================
Overview: contains objects defining any actor in the game, including player, friendlies, and hostiles.
============================================================================================================================================================================================		
To Do:			
============================================================================================================================================================================================
Notes:
	    
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
		head:{id:'metalhelm1', name: "Old Metal Helm", type:'armor', detail: "a simple metal helm.", slot:'head', armor: 2, defense: 0, weight: 1, value: 5},
		neck:undefined,
		chest:{id:'lthrjrk', name: "Leather Jerkin", type:'armor', detail: "a leather jerkin.", slot:'chest', armor: 8, defense: -5, weight: 15, value: 20},
		lfinger:undefined,
		rfinger:undefined,
		rhand:{id:'woodclub', name: "wood club", type:'weapon', detail: " a wood club with a few knicks in it.", slot:'rhand', damage: 10, weight: 5, value: 1},
		lhand:undefined,
		feet:{id:'wornlthrboots', name: "Worn Leather Boots", type: 'armor', detail: " some old leather boots.", slot:'feet', armor: 2, defense: 0, weight: 1, value: 5}
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
function Actor(data){

	//Player.call(this, data);  //currently the player uses fullName property and actors use name properties

	this.id = data.id;
	this.name = data.name;
	this.detail = data.detail;
	this.isHostile;
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