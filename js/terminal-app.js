//set up canvas


/*
	- Need to add Cursor to show current text position
	- Need to add word wrap so that words don't get split
	- Need to add backspace and delete
	- would even be nice to add arrows for moving back and forth on line?
	- also need to disable space, backspace, etc. from affecting browser window
	- possibly add blinking cursor  
	  
*/

var body = document.querySelector('body');
var terminal = document.getElementById('terminal');
var canvas = document.getElementById('canvas');
var prompt = ">>";
var keyBuffer = [prompt];
var text = prompt;
var ctx = canvas.getContext("2d");

var cursorX = 0,
	cursorY = 0;

canvasInit();


//set up key capture event
body.addEventListener('keypress', function(key){
	var pos = 100;
	var temp;
	text += String.fromCharCode(key.which);
	if(key.which == 13){

	}
	//implimentation of a line buffer to display multiple lines of text
	//Just need a word wrap function now
	if(key.which == 13){  //If there is a carraige return
		pos = text.length - 1;
		temp = prompt
		text = text.slice(0, pos);
		keyBuffer[keyBuffer.length - 1] = text;
		keyBuffer.push(temp);
		text = prompt;
	}
	else if(text.length > 100) {
		pos = 100;
		temp = prompt + text.slice(pos);
		text = text.slice(0, pos);
		keyBuffer[keyBuffer.length - 1] = text;
		keyBuffer.push(temp);
		text = prompt;
	}
	else{
		console.log("This should not create new lines!");
		keyBuffer[keyBuffer.length - 1] = text;	
	}
		
		
	drawText(keyBuffer);
	console.log(keyBuffer);
	return;
});





//initalize the canvas
function canvasInit(){
	canvas.width = 1200;
	canvas.height = 800;

	ctx.fillStyle = 'green';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//window.requestAnimationFrame(drawCursor);
}

//draw text
function drawText(keyBuffer){
		var lineHeight = 30;
		var fontSize = 26;
		var fontType = "sans-serif";
		

		ctx.fillStyle = 'green';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.font = fontSize + "px " + fontType;
		ctx.fillStyle = 'black';

		for(var i = 0; i <= keyBuffer.length-1; i++) {
			ctx.fillText(keyBuffer[i], 0, lineHeight * (i + 1));
			//console.log("looping:", i);	
		}

		//cursorX = (keyBuffer[keyBuffer.length - 1].length) * (fontSize * 0.5);
		//cursorY = ((keyBuffer.length-1) * lineHeight) + (lineHeight/2);
		//console.log(cursorX, cursorY);
		//ctx.fillStyle = 'white';
		//ctx.fillRect(cursorX, cursorY, fontSize / 2, fontSize / 2);

		/*Draw cursor at end of line -
		   1. calculate x position based on length of last keyBuffer line * font size?
		   2. calculate y position based on length of keyBuffer (i.e. number of lines) * line height
		*/
		
}

function drawCursor(){
	ctx.fillStyle = 'white';
	ctx.fillRect(0,30, 10, 10);
}

	


