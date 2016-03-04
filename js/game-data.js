/* 
############################################################################################################################################################################################
############################################################################################################################################################################################

	To Do:
	
	
    Overview:
			- game-data.js (holds games global array and HoH game data)
			- various game data files for each game
			

	Notes:
		- 
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

var Test = {
				"title": "TEST!",
				"author": "Lord Niah",
				"detail": "A very testy kind of test game!",
				"rooms":
				[
					{"id":"room1", "name":"room1", "detail": "You are in a large, ornate hallway.", "exits":[{"id":"door1", "name":"north", "link":"room2"}], "actors":[{"name": "Ralph"}]},
					{"id":"room2", "name":"room2", "detail": "You are in a long, narrow hallway.", "exits":[{"id":"door2", "name":"south", "link":"room1"}], "actors":[{"name": "Bob"}]}
				],
				"items":[],
				"actors":[],
				"dialog":[]
			}


//################################################################################################################################################################################

var games = [Test];  //This holds the variable names referencing each game json file.


//################################################################################################################################################################################



