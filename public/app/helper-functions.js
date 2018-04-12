//#####################################################################################################
	//getMatchedItem:
	//-----------------------------------------------------------------------------------------------------
	//  Inputs:
	//		words - a list/array of strings to be searched against
	//      target - a second list to search against words for a match
	//      property(optional) - if list contains objects, then the property to access
	//  Return: the list item that was matched or false if no match
	//#####################################################################################################      
	function getMatchedItemInList(words, target, property){

		var sentence = words.join(" ").toLowerCase();
		var item = undefined;
		var value;

		//console.log("word list is:", sentence);

		//Now iterate over the target list
		for(var i = 0; i < target.length; i++){
			if(property)
				value = target[i][property]
			else
				value = target[i]
			//console.log("my item name is:", target[i][property]);
			if(sentence.search(value.toLowerCase()) != -1){
				item = target[i];
				return item; //return the item in the list that matched
			}
		}

		return item;
	}
	//#####################################################################################################
	//getMatchedItem:
	//-----------------------------------------------------------------------------------------------------
	//  Inputs:
	//		words - a list/array of strings to be searched against
	//      target - a second list to search against words for a match
	//      property(optional) - if list contains objects, then the property to access
	//  Return: the list item that was matched or false if no match
	//
	//   add: could use arguments and iterate through them to get nested properties?
	//#####################################################################################################      
	function removeMatchedItemInList(words, target, property){
		var sentence = words.join(" ").toLowerCase();
		var value;
		var item = undefined;

		//Now iterate over the target list
		for(var i = 0; i < target.length; i++){
			if(property)
				value = target[i][property]
			else
				value = target[i]
			if(sentence.search(value.toLowerCase()) != -1){
				item = target[i]; //return the item in the list that matched
				target.splice(i, 1);  //removes item from target
			}
		}

		return item;
		
	}


	function getMatchedItemInObject(words, target, property){
		var sentence = words.join(" ").toLowerCase();
		var value;
		var item = undefined
		//console.log("word list is:", sentence);

		//Now iterate over the target list
		for(key in target){
			if( target.hasOwnProperty(key) && target[key]){
				if(property)
					value = target[key][property]
				else
					value = target[key]
				//console.log("my item name is:", target[i][property]);
				if(sentence.search(value.toLowerCase()) != -1){
					item = target[key];
					return item; //return the item in the list that matched	
				}
			
			}
		}

		return item;

	}

	