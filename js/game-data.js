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

var HoH = {
	rooms: [],
	items: [],
	mobiles: []
	dialog: []
};



//################################################################################################################################################################################

var games = [HoH];  //This holds the variable names referencing each game json file.


//################################################################################################################################################################################



