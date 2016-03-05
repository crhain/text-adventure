//#####################################################################################################
	//getMatchedItem:
	//-----------------------------------------------------------------------------------------------------
	//  Inputs:
	//		words - a list/array of strings to be searched against
	//      target - a second list to search against words for a match
	//      property(optional) - if list contains objects, then the property to access
	//  Return: the list item that was matched or false if no match
	//#####################################################################################################      
	function getMatchedItem(words, target, property){

		var sentence = words.join(" ").toLowerCase();
		console.log("word list is:", sentence);

		//Now iterate over the target list
		for(var i = 0; i < target.length; i++){
			console.log("my item name is:", target[i][property]);
			if(sentence.search(target[i][property].toLowerCase()) != -1){
				return target[i]; //return the item in the list that matched
			}
		}

		return false;
	}
	//#####################################################################################################
	//getMatchedItem:
	//-----------------------------------------------------------------------------------------------------
	//  Inputs:
	//		words - a list/array of strings to be searched against
	//      target - a second list to search against words for a match
	//      property(optional) - if list contains objects, then the property to access
	//  Return: the list item that was matched or false if no match
	//#####################################################################################################      
	function removeMatchedItem(words, target, property){
		var sentence = words.join(" ").toLowerCase();
		var item = undefined;

		//Now iterate over the target list
		for(var i = 0; i < target.length; i++){

			if(sentence.search(target[i][property].toLowerCase()) != -1){
				item = target[i]; //return the item in the list that matched
				target.splice(i, 1);  //removes item from target
			}
		}

		return item;
		
	}