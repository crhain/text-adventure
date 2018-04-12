/* 
############################################################################################################################################################################################
############################################################################################################################################################################################
GAME-ITEMS.JS
============================================================================================================================================================================================
Overview:	
============================================================================================================================================================================================		
To Do:			
============================================================================================================================================================================================
Notes:
	    
###############################################################################################################################################################################################	  
*/

/*
//############################################################################################################################################
ITEM OBJECT CONSTRUCTOR FUNCTION
============================================================================================================================================
OVERVIEW: object constructor for an item object. Items represent any non-mobile object in the game, including both objects that the player can 
 pick up and objects that cannot be picked up.

	INPUTS:  data : an object literal that contains all data needed to create this object

	OUTPUTS: returns an Item object
#############################################################################################################################################
*/
import {getMatchedItemInList, removeMatchedItemInList, getMatchedItemInObject} from "../helper-functions.js";

export const Item = function (data){
	this.id = 					data.id;
	this.name = 				data.name;
	//this.detail_placed =		data.detail_placed;   //this represents the description of the item the first time it is viewed
	//this.detail_dropped =		data.detail_dropped  //this represents the description of the item when it is dropped
	this.detail =				data.detail;         //this is the item detail when player looks at the item
	//this.value =				data.value;          //value in 
	//this.weight =				data.weight;
	this.fixed = false;
	this.inContainer = false;    //property that prevents items from being shown by look command if they are in a container.  Must look at the container itself

	//determine fixed property and set to default if not set.  Fixed indicates if the player can get the object or not.
	if(data.hasOwnProperty(this.fixed)){
		this.fixed = data.fixed
	}
	
				

};

Item.prototype = Object.create(Object.prototype); 

//Method: displays the items details
Item.prototype.show = function(display, intro){
	var text = "";
		if(intro) 	text = intro;

		//show room description
		display.showText(text + this.detail);		
}

/*
//############################################################################################################################################
ARMOR OBJECT CONSTRUCTOR FUNCTION (Inherits from Item)
============================================================================================================================================
OVERVIEW: object constructor for any weareable object. 

	INPUTS:  data : an object literal that contains all data needed to create this object

	OUTPUTS: returns an Item object
#############################################################################################################################################
*/
export const Armor = function (data){

	Item.call(this, data);

	this.type = data.type;
	this.slot = data.slot;
	this.armor = data.armor;
	this.defense = data.defense;
};

Armor.prototype = Object.create(Item.prototype);
Armor.prototype.constructor = Armor;  //gives it correct constructor method

/*
//############################################################################################################################################
WEAPON OBJECT CONSTRUCTOR FUNCTION (Inherits from Item)
============================================================================================================================================
OVERVIEW: object constructor for object that can be used as a weapon. 

	INPUTS:  data : an object literal that contains all data needed to create this object

	OUTPUTS: returns an Item object
#############################################################################################################################################
*/
export const Weapon = function (data){

	Item.call(this, data);

	this.type = 		data.type;
	this.slot = 		data.slot;
	this.damage = 		data.damage;

};

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;  //gives it correct constructor method


/*
//############################################################################################################################################
CONTAINER OBJECT CONSTRUCTOR FUNCTION (Inherits from Item)
============================================================================================================================================
OVERVIEW: object constructor for object that is fixed and can contain other objects 

	INPUTS:  data : an object literal that contains all data needed to create this object

	OUTPUTS: returns an Item object
#############################################################################################################################################
*/
export const Container = function (data){

	Item.call(this, data);

	this.type = data.type;
	this.fixed = true;  //set fixed property to true by default (overrides item fixed property)
	this.closed = true;  //change this to obtain state from data later on
	this.locked = false; //change this to obtain state from data later on

	this.contents = [];


	for(var i = 0; i < data.contents.length; i++){
		if(data.contents[i].hasOwnProperty('type')){
			if(data.contents[i].type == 'armor'){
				this.contents.push(new Armor(data.contents[i]));
			}							
			else if(data.contents[i].type == 'weapon'){
				this.contents.push(new Weapon(data.contents[i]));
			}
			else if(data.contents[i].type == 'container'){
				this.contents.push(new Container(data.contents[i]));
			}			  			
			else{
				this.contents.push(new Item(data.contents[i]));  
			}
		}
		else{
			this.contents.push(new Item(data.contents[i]));	
		}		
	}
};

Container.prototype = Object.create(Item.prototype);
Container.prototype.constructor = Container;  //gives it correct constructor method


Container.prototype.removeItem = function(item){
	//find item in rooms list of items
	for(var i = 0; i < this.contents.length; i++){
		if(item.id == this.contents[i].id){
			this.contents.splice(i, 1);
		}
	}	
}

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