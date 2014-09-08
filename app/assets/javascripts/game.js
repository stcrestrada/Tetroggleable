var ROWS = 20;
var COLS = 10;
var SIZE = 32;
var SPEEDS = [500, 450, 400, 350, 300, 250, 200, 150, 100, 50, 25, 10, 5, 1];
var BOARDHEIGHT = 640;
var BOARDWIDTH = 320;

var canvas;
var context;
var currentBlock;
var currentTime;
var isGameOver;
var lineScore;
var previousTime;
var currentLevel = 1;
var currentSpeed = SPEEDS[currentLevel-1];
var dicts;
var gameIsPaused = false;
var linePoints = 10;

function setRowsCols() {
	width = $(window).width();
	height = $(window).height();

	if (height < 1160) {
		ROWS = 17;
		BOARDHEIGHT = 544;
		$("#gameCanvas").attr("height", 544);
	}
}

$(window).load(function(){

	canvas = document.getElementById('gameCanvas');
	context = canvas.getContext('2d');
	lineScore = $('#lines');
	previousTime = 0;
	currentTime = 0;

	//shrink for smaller screen
	setRowsCols();

	startGame();
	$(document).keydown(function(event){
			k = event.keyCode
			if(k==32||k==37||k==38||k==39||k==40)
				getKeyCode(event);
			if(k==13)
				findWord();
			if(k==27)
				toggleGamePause();
	})
		// drawBoard();
		// block = getRandomBlock()
		// drawBlock(block);
		loadDictionary();
});

function startGame() {
	var row, col;
	currentLines = 0;
	isGameOver = false;
	currentLevel = 1;
	currentSpeed = SPEEDS[currentLevel - 1];
	$("#levels").text(1)

	gameData = new Array();

		for(row= 0; row < ROWS; row++) {
			gameData[row] = new Array();
			for(col = 0; col < COLS; col++) {
				// gameData[r].push(0);
				gameData[row][col] = 0;
			}
		}

	currentBlock = getRandomBlock();
	var requestAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	window.requestAnimationFrame = requestAnimFrame;

	requestAnimationFrame(updateGame);
}

function drawTile(drawX, drawY) {
	context.strokeStyle = "#000";
  context.beginPath();
 	// context.fillStyle = "#3c0";
 	context.rect(drawX * SIZE, drawY * SIZE , SIZE, SIZE);
 	context.fill();
 	context.stroke();
}

function drawTileBackground(drawX, drawY, scrabbleExtras) {
	numberPosX = drawX * SIZE;
	numberPosY = drawY * SIZE;
	context.strokeStyle = "#000";
  context.beginPath();
	context.rect(drawX * SIZE, drawY * SIZE , SIZE, SIZE);

	if (scrabbleExtras == "NA") {
	image = new Image();
	image.src = "http://www.mobilier-beton.net/wp-content/uploads/2013/05/Wood1.jpg";
	pattern = context.createPattern(image, "no-repeat");
  context.fillStyle = pattern;
 };

 	if (scrabbleExtras == "WX2"){

 		context.fillStyle = "#82002C";
 		context.fill();
 		context.stroke();
 	};
 		if (scrabbleExtras == "WX3"){

 		context.fillStyle = "#110649";
 		context.fill();
 		context.stroke();
 	};

 	if (scrabbleExtras == "LX2"){

 		context.fillStyle = "#E77F9C";
 		context.fill();
 		context.stroke();
 	};

 	if (scrabbleExtras == "LX3"){

 		context.fillStyle = "#5D709A";
 		context.fill();
 		context.stroke();
 	};

 context.fillRect(numberPosX, numberPosY, SIZE, SIZE);
};
// function drawValues(drawX, drawY, scrabbleExtras) {
// 	numberPosX = drawX * SIZE;
// 	numberPosY = drawY * SIZE;

// 	if (scrabbleExtras == "WX2"){
// 		context.strokeStyle = "#000";
//   	context.beginPath();
//  		context.fillStyle = "#F62F68";
//  		context.rect(drawX * SIZE, drawY * SIZE , SIZE, SIZE);
//  		context.fill();
//  		context.stroke();

// 	}
// }

function drawLetter(drawX, drawY, letter) {
	letterPosX = drawX * SIZE + 7;
	letterPosY = drawY * SIZE + 27;

	context.fillStyle = "#000";
 	context.font = '20pt Arial';
 	context.fillText(letter, letterPosX, letterPosY, SIZE);
}

function drawNumber(drawX, drawY, score) {
	numberPosX = drawX * SIZE + 2;
	numberPosY = drawY * SIZE + 10;

	context.fillStyle = "#000";
 	context.font = 'bolder 8pt Arial';
 	context.fillText(score, numberPosX, numberPosY, SIZE);
}


function drawBoard() {
	// context.drawImage(bgImg, 0, 0, 320, 640, 0, 0, 320, 640);
	context.beginPath();
	context.rect(0, 0, 320, 640);
	context.fillStyle="black";
	context.fill();
	// context.beginPath();
	// context.lineWidth = "2";
	// context.strokeStyle = "yellow";
	// context.stroke();

	for(var row = 0; row < ROWS; row++) {
		for(var col = 0; col < COLS; col++) {
			if(gameData[row][col] != 0) {
				// context.drawImage(blockImg, (gameData[row][col] - 1) * SIZE, 0, SIZE, SIZE, col * SIZE, row * SIZE, SIZE, SIZE); -->
				// context.beginPath();
				// context.rect(col * SIZE, row * SIZE, SIZE, SIZE);
				// context.fillStyle="green";
				// context.fill();
				tile = gameData[row][col]
				drawTileBackground(col, row, tile.scrabbleExtras);
				drawTile(col, row);
				drawLetter(col, row, tile.letter);
				drawNumber(col, row, tile.score);
			}
		}
	}
}

function drawBlock(block) {
	var drawX = block.gridX;
	var drawY = block.gridY;
	var rotation = block.currentRotation;

// drawY = 10;

	for(var row = 0, len = block.rotations[rotation].length; row < len; row++) {
		for(var col = 0, len2 = block.rotations[rotation][row].length; col < len2; col++) {
			if(block.rotations[rotation][row][col] != 0 && drawY >= 0) {
				// context.drawImage(blockImg, block.color * SIZE, 0, SIZE, SIZE, drawX * SIZE, drawY * SIZE, SIZE, SIZE);
				// context.rect(drawX * SIZE, drawY * SIZE , SIZE, SIZE);
				// context.beginPath();
				// context.rect(drawX * SIZE, drawY * SIZE , SIZE, SIZE);
				// context.fillStyle="green";
				// context.fill();
				// context.stroke();
				// context.fillStyle ="black";
				// // context.font = 'bold 20pt Calibri';
				// context.fillText("A", 0, 0);
				// context.fillStyle="white"context.font = "18pt Arial";
				tile = block.rotations[rotation][row][col]
				drawTileBackground(drawX, drawY, tile.scrabbleExtras);
				drawTile(drawX, drawY);
				drawLetter(drawX, drawY, tile.letter);
				drawNumber(drawX, drawY, tile.score);

			}
			drawX += 1;
		}

		drawX = block.gridX;
		drawY += 1;
	}

}

function getKeyCode(e) {
	// if(!e) { var e = window.event; }
	e.preventDefault();

	if(isGameOver != true) {
		switch(e.keyCode) {
			case 32: {
				letBlockFall();
			}
			break;

			case 37: {
				if( validateMove(currentBlock.gridX - 1, currentBlock.gridY, currentBlock.currentRotation) )
					currentBlock.gridX--;
			}
			break;

			case 39: {
				if( validateMove(currentBlock.gridX + 1, currentBlock.gridY, currentBlock.currentRotation) )
					currentBlock.gridX++;
			}
			break;

			case 38: {
				var newRotation = currentBlock.currentRotation - 1;
				if(newRotation < 0)
					newRotation = currentBlock.rotations.length - 1;

				if( validateMove(currentBlock.gridX, currentBlock.gridY, newRotation) )
					currentBlock.currentRotation = newRotation;
			}
			break;

			case 40: {
				if( validateMove(currentBlock.gridX, currentBlock.gridY + 1, currentBlock.currentRotation) )
					currentBlock.gridY++;
			}
			break;
		}
	}
	else {
		startGame();
	}
}

function letBlockFall() {
	for (var i=0; i<ROWS; i++) {
		if (validateMove(currentBlock.gridX, currentBlock.gridY + 1, currentBlock.currentRotation))
			currentBlock.gridY++;
	}
}

function validateMove(xpos, ypos, newRotation) {
	var result = true;
	var newx = xpos;
	var newy = ypos;

	for(var row = 0, length1 = currentBlock.rotations[newRotation].length; row < length1; row++) {
		for(var col = 0, length2 = currentBlock.rotations[newRotation][row].length; col < length2; col++) {
			if(newx < 0 || newx >= COLS) {
				result = false;
				col = length2;
				row = length1;
			}

			if(gameData[newy] != undefined && gameData[newy][newx] != 0
				&& currentBlock.rotations[newRotation][row] != undefined && currentBlock.rotations[newRotation][row][col] != 0) {
				result = false;
				col = length2;
				row = length1;
			}

			newx += 1;
		}

		newx = xpos;
		newy += 1;

		if(newy > ROWS) {
			row = length1;
			result = false;
		}
	}

	return result;
}

function updateGame() {
  currentTime = new Date().getTime();

  if (currentTime - previousTime > currentSpeed && !(gameIsPaused)) {
    // drop currentBlock every half-second
    if (validateMove(currentBlock.gridX, currentBlock.gridY + 1, currentBlock.currentRotation)) {
      currentBlock.gridY += 1;
    }
    else {
      landBlock(currentBlock);
      currentBlock = getRandomBlock();
    }

    // update time
    previousTime = currentTime;
  }

  context.clearRect(0, 0, BOARDWIDTH, BOARDHEIGHT);
  drawBoard();
  drawBlock(currentBlock);

  if (isGameOver == false) {
    requestAnimationFrame(updateGame);
  }
  else {
    context.fillText("GAME OVER", 10 , 10);
    context.fillStyle = "white";
	}
}

function checkForCompleteLines() {
	var lineFound = false;
	var fullRow = true;
	var row = ROWS - 1;
	var col = COLS - 1;

	while(row >= 0) {
		while(col >= 0) {
			if(gameData[row][col] == 0) {
				fullRow = false;
				col = -1;
			}
			col--;
		}

		if(fullRow == true) {
			console.log("fullRow == true, line 225");
			clearCompletedRow(row);

			row++;
			lineFound = true;
			currentLines++;
			advanceLevelIfNeeded();
		}
		fullRow = true;
		col = COLS - 1;
		row--;
	}
	if(lineFound) {
		$("#lines").text(currentLines.toString());
	}
}

function landBlock(block) {
	var xpos = block.gridX;
	var ypos = block.gridY;
	var rotation = block.currentRotation;

	for(var row = 0, len = block.rotations[rotation].length; row < len; row++) {
		for(var col = 0, len2 = block.rotations[rotation][row].length; col < len2; col++) {
			if(block.rotations[rotation][row][col] != 0 && ypos >= 0) {
				tile = block.rotations[rotation][row][col]
				gameData[ypos][xpos] = tile;
			}
			xpos += 1;
		}
		xpos = block.gridX;
		ypos += 1;
	}
	checkForCompleteLines();

	if(block.gridY < 0) {
		isGameOver = true;
	}
}

function clearTile(coords) {
	var row = coords[0];
	var col = coords[1];
	var val = gameData[row-1][col];

	for (var i = row; i > 0; i--) {
		gameData[i][col] = gameData[i-1][col];
		// if( gameData[row-val][col] == 0 ) {
		// 		gameData[row][col] = 0;
		}
	}


function clearTiles(array) {
	for(var i = 0; i < array.length; i++) {
		clearTile(array[i]);
	}
};

function clearCompletedRow(row) {
	var row = row;
	var col = 0;

	while(row >= 0) {
		while(col < COLS) {
			if(row > 0)
				gameData[row][col] = gameData[row-1][col];
			else
				gameData[row][col] = 0;


			col++;
		}
		col = 0;
		row --;
	}
	updateScores('line', linePoints)
}

function advanceLevelIfNeeded() {
	if (currentLines % 10 === 0 && currentLevel < SPEEDS.length){
		currentLevel += 1;
		currentSpeed = SPEEDS[currentLevel - 1];
		$("#levels").text(currentLevel.toString());
	};
}

function updateScores(type, points) {
	if (type === 'line') {
		var lines = parseInt($("#lines").text()) + 1;
		$("#lines").text(lines);
	}
	else if (type === 'word') {
		var scrabbleScore = parseInt($("#scrabble_score").text()) + points;
		$("#scrabble_score").text(scrabbleScore);
	}
	var totalScore = parseInt($("#overall_score").text()) + points;
	$("#overall_score").text(totalScore);
}

function calculateScrabbleScore(tiles) {
	var score = 0;
	var extraMultiplier = 1;
	
	for (var i = 0; i < tiles.length; i++) {
		tile = gameData[tiles[i][0]][tiles[i][1]];
		console.log(tile)
		//tileScore = tiles[i].score

		currentLetterPoints = tile.score;

		switch(tile.scrabbleExtras) {
			case "NA": extraMultiplier *= 1;		break;
			case "WX2": extraMultiplier *= 2;		break;
			case "WX3": extraMultiplier *= 3;		break;
			case "LX2": currentLetterPoints *=2;	break;
			case "LX3": currentLetterPoints *=3;	break;
		}	
		
		score += currentLetterPoints;
		console.log("LETTER and POINTS")
		console.log(tile.letter + ":" + currentLetterPoints)
	}

	console.log("SCORE so far");
	console.log(score)
	score *= extraMultiplier;
	console.log("Final Score");
	console.log(score)

	if (tiles.length >= 7) {
		score *= 2;
	}
	
	return score;
}

function loadDictionary() {
  $.get( "/assets/dictionary.txt", function( text ) {
    dicts = text.split( "\n" );
  } );
}

function findWord() {
	letters = $("#boggle_letters").val();
	$("#boggle_letters").val("");
	var currentLetters = letters.split( "" );
	if( currentLetters.length >= 3 ) {
		word = currentLetters.join("");
		// if( dicts.indexOf(word.toUpperCase())  != -1 ) {
		// 	isWordOnBoard(word, gameData);
		// }
		tilesOnBoard = isWordOnBoard(word.toUpperCase(), gameData);

		//if isWordOnBoard does not return false, update score and make tiles fall
		if (tilesOnBoard) {
			wordScore = calculateScrabbleScore(tilesOnBoard)
			updateScores('word', wordScore)
			makeTilesFall(tilesOnBoard);
		}
		else {
			console.log("word not found");
		}
	}
}

function makeTilesFall(tilesArray) {
	console.log("Here are the tile coords to fall sent back from boggle.js:");
	console.log(tilesArray);
	clearTiles(tilesArray)
}

function toggleGamePause() {
	gameIsPaused = !(gameIsPaused);
}

