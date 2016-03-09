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
OVERVIEW: object constructor for an actor object. Actors represent any mobile character in the game, including enemies, friendlies, and 
merchtants.

	INPUTS:  data : an object literal that contains all data needed to create this object object

	OUTPUTS: returns an Item object
#############################################################################################################################################
*/
function Item(data){
	this.id = 					data.id;
	this.name = 				data.name;
	//this.detail_placed =		data.detail_placed;   //this represents the description of the item the first time it is viewed
	//this.detail_dropped =		data.detail_dropped  //this represents the description of the item when it is dropped
	this.detail =				data.detail;         //this is the item detail when player looks at the item
	this.value =				data.value;          //value in 
	this.weight =				data.weight;

};

Item.prototype = Object.create(Object.prototype); 



function Armor(data){
	this.type = data.type;
	this.slot = data.slot;
	this.armor = data.armor;
	this.defense = data.defense;
};

Armor.prototype = Object.create(Item.prototype);
Armor.prototype.constructor = Armor;  //gives it correct constructor method


function Weapon(data){
	this.type = data.type;
	this.slot = data.slot;
	this.damage = data.damage;

};

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;  //gives it correct constructor method




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