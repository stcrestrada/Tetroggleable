// board = [
// 	['A', 'B', 'C', 'D'],
// 	['E', 'F', 'G', 'H'],
// 	['I', 'J', 'K', 'L'],
// 	['M', 'N', 'O', 'P']
// ]

// word = 'FIZ'
// word2 = 'FIN'
// word3 = 'LOP'
// word4 = 'ABCD'
// word5 = 'AFCH'
// word6 = 'DJP'

board = [];

function isWordOnBoard(word, board) {
  wordArray = word.split("")
  board = board

  var firstLetterCoord = loop(board, wordArray[0]);
  var isValidWord = true;
  var validWordsCoords = false;

  if(firstLetterCoord.length > 0) {
    for (var i=0; i < firstLetterCoord.length; i++) {
      console.log('checking new first letter');
      // priorLetter = wordArray[0];
      console.log("First letter found! Coords are below");
      console.log(firstLetterCoord[i]);
      newCoordinates = firstLetterCoord[i];
      coordinateArray = [firstLetterCoord[i]]

      for (var i = 0; i < (wordArray.length - 1); i++) {
        //search for each corresponding letter in neighbors of previous coordinates
        neighborArray = getNeighbors(newCoordinates);
        newCoordinates = checkNeighbors(neighborArray, wordArray[i+1], board);
        console.log('coordinates returned from checkNeighbors');
        console.log(newCoordinates);
        coordinateArray.push(newCoordinates);

        // console.log('new coordinates return:');
        // console.log(newCoordinates);
        if (newCoordinates === false || newCoordinates === undefined) {
          invalidWord();
          isValidWord = false;
          break;
        }
      }

      if (isValidWord === true) {
        validWordsCoords = coordinateArray;
      }
        
    }
    return validWordsCoords;
  }
  else
    return false;

}

function loop(array, targetLetter){
  result = false;
  coordinateArray = [];
  console.log("Looking for " + targetLetter);
  for(var r = 0; r < array.length; r++){
    row = array[r];
    for(var c = 0; c < row.length; c++) {
      if(row[c].letter && row[c].letter == targetLetter) {
        result =  true;
        coordinates = [r, c];
        coordinateArray.push(coordinates);
      }
    }
  }
  return coordinateArray;
}

function getNeighbors(coordinates) {
	x_coord = coordinates[0];
	y_coord = coordinates[1];

	var neighbors = [
            [- 1, -1],
            [-1, 0],
            [-1, +1],
            [0, -1],
            [0, +1],
            [+1, -1],
            [+1, 0],
            [+1, +1]
            ]
  neighborArray = [];

	for(var r = 0; r < neighbors.length; r++){
	  row = neighbors[r];
	  neighborArray.push([x_coord + row[0], y_coord + row[1]])
	}

  //returns all coordinates of current letter's neighbors
  return neighborArray;
}

function checkNeighbors(neighbors, currentLetter, board) {
	lettersArray = [];
	letterCoords = [];

	for(var i = 0; i < neighbors.length; i++){
		if (neighbors[i][0] >= 0 && neighbors[i][1] >= 0) {
			if (board[neighbors[i][0]][neighbors[i][1]] != undefined && board[neighbors[i][0]][neighbors[i][1]].letter) {
				letter = board[neighbors[i][0]][neighbors[i][1]].letter;
				lettersArray.push(letter);

				if (letter == currentLetter) {
          console.log('letter matches')
					letterCoords = [neighbors[i][0], neighbors[i][1]];
					// console.log('matching letter coordinates')
					// console.log(letterCoords);
					return letterCoords;
				}
			}
		}
	}
}

function invalidWord() {
	console.log('Your word is not on the board!')
}

