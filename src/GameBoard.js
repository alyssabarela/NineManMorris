
	function GameBoard(xLoc, yLoc, sideLength){

	this.x = xLoc;
	this.y = yLoc;
	this.sideLength = sideLength;
	var gamePieceArray = new Array();
	/*
	The game board is built out of KinetcJS primitives, namely:
	3 successively smaller boxes, each on top of the other
	1 horizontal line crossing the middle of the board, covered
	by the smallest box.
	1 vertical line crossing the middle of the board, covered
	by the smallest box.
	24 dots on the corners and midpoints of the sides of each box.

	None of these primitives are draggable
	*/
	
	var stageContainer = new Kinetic.Stage({
		container: 'container',
		width: 500,
		height: 600
	});
		
	var game_board = new Kinetic.Group({
		x: this.x,
		y: this.y
	});
	
	var gameBoardLayer = new Kinetic.Layer();
	
	this.drawBoxes(game_board);
	
	gameBoardLayer.add(game_board);
	
	this.drawGamePieces(gameBoardLayer, gamePieceArray);
	
	stageContainer.add(gameBoardLayer);

}
	
GameBoard.prototype.drawBoxes = function(game_board) {
	//The outer for-loop draws each box and the the vertical and
	//horizontal lines.
	for(var i = 0; i < 3; i++) {
		var box_xy_offset = i * 50;
		var box_side_length = this.sideLength - (i * 100);

	//This object is created in each iteration of the for-loop
	//and is made successively smaller.
	var box = new Kinetic.Rect({
		x: box_xy_offset,
		y: box_xy_offset,
		width: box_side_length,
		height: box_side_length,
		fill: 'white',
		stroke: 'black',
		strokeWidth: 4
	});

	//This if statement checks to see if the second box has
	//been drawn. If it has then the horizontal and vertical
	//lines are drawn.
	if(i == 2) {
		this.drawLines(game_board);
	}
	game_board.add(box);

	this.drawSpaces(game_board, box_xy_offset, box_side_length);
	}
}

GameBoard.prototype.drawLines = function(game_board) {
	var  vertical_line = new Kinetic.Line({
		points: [this.sideLength/2, 0, this.sideLength/2, this.sideLength],
		stroke: 'black',
		strokeWidth: 4
	});

	var  horizontal_line = new Kinetic.Line({
		points: [0, this.sideLength/2, this.sideLength, this.sideLength/2],
		stroke: 'black',
		strokeWidth: 4
	});

	game_board.add(horizontal_line);
	game_board.add(vertical_line);
}

GameBoard.prototype.drawSpaces = function(game_board, box_xy_offset, box_side_length) {
	//This function helps the for-loop below determine the
	//x or y position for each of the 24 dots
	var get_coordinate = function(index) {
		return box_xy_offset + index * .5 * box_side_length;
	}
	//This for-loop draws the 24 dots
	//j helps determine the x position of the dot
	//k helps determine the y position of the dot
	for(var j = 0; j < 3; j++) {
		for(var k = 0; k < 3; k++) {
			if(j != 1 || k != 1) {
				var dot = new Kinetic.Circle({
					x: get_coordinate(j),
					y: get_coordinate(k),
					radius: 10,
					fill: 'black'
				});
				game_board.add(dot);
			}
		}
	}

}



GameBoard.prototype.drawGamePieces = function(layer, gPieceArray) {
	//This for-loop creates all game pieces	
	
	
	for(var t = 0; t < 9; t++) {
	  
		var game_piece = new Kinetic.Circle({
		  x: this.x + this.sideLength - 15 * t,
		  y: this.y - 50,
		  radius: 20,
		  fill: 'red',
		  stroke: 'black',
		  strokeWidth: 2,
		  draggable: false
		});
		
		//game_piece.on('dragend', function() {
		//    this.draggable(false);
		//});
		
		gPieceArray.push(game_piece);
		layer.add(game_piece);
		
		game_piece = new Kinetic.Circle({
		  x: this.x + 15 * t,
		  y: this.y - 50,
		  radius: 20,
		  fill: 'white',
		  stroke: 'black',
		  strokeWidth: 2,
		  draggable: t==8
		});
		
		//game_piece.on('dragend', function() {
		//    this.draggable(false);
		//});
		
		gPieceArray.push(game_piece);
		layer.add(game_piece);

		//the t == 8 results in a boolean value, used to set the "draggable" option
		//gPieceArray.push(new GamePiece(this.x + this.sideLength - 15 * t, this.y - 50, 20, 'red', 'black', 2, false, layer, gPieceArray));
		//gPieceArray.push(new GamePiece(this.x + 15 * t, this.y - 50, 20, 'white', 'black', 2, t==8, layer, gPieceArray));
		
		
		//gPieceArray[17].game_piece.on('dragend', function() {
		    //this.writeMessage('dragend');
		  
		//});
		/*
		gArray[0].game_piece.draggable(true);
		gArray[1].game_piece.draggable(true);
		gArray[2].game_piece.draggable(true);
		gArray[3].game_piece.draggable(true);
		gArray[4].game_piece.draggable(true);
		gArray[5].game_piece.draggable(true);
		gArray[6].game_piece.draggable(true);
		gArray[7].game_piece.draggable(true);
		gArray[8].game_piece.draggable(true);
		
		//this.draggable(false);
		//gArray[0].game_piece.draggable(true);

		
		//});
		//layer.add(whitePieceArray[t].game_piece);
		//layer.add(redPieceArray[t].game_piece);
		*/
		
		
	}
	
	gPieceArray[17].on('dragend', function() {
		this.draggable(false);
		gPieceArray[16].draggable(true);
	    });
		
		gPieceArray[16].on('dragend', function() {
		this.draggable(false);
		gPieceArray[15].draggable(true);
	    });
		
		gPieceArray[15].on('dragend', function() {
		this.draggable(false);
		gPieceArray[14].draggable(true);
	    });
		
		gPieceArray[14].on('dragend', function() {
		this.draggable(false);
		gPieceArray[13].draggable(true);
	    });
		
		gPieceArray[13].on('dragend', function() {
		this.draggable(false);
		gPieceArray[12].draggable(true);
	    });
		
		gPieceArray[12].on('dragend', function() {
		this.draggable(false);
		gPieceArray[11].draggable(true);
	    });
		
		gPieceArray[11].on('dragend', function() {
		this.draggable(false);
		gPieceArray[10].draggable(true);
	    });
		
		gPieceArray[10].on('dragend', function() {
		this.draggable(false);
		gPieceArray[9].draggable(true);
	    });
		
		gPieceArray[9].on('dragend', function() {
		this.draggable(false);
		gPieceArray[8].draggable(true);
	    });
		
		gPieceArray[8].on('dragend', function() {
		this.draggable(false);
		gPieceArray[7].draggable(true);
	    });
		
		gPieceArray[7].on('dragend', function() {
		this.draggable(false);
		gPieceArray[6].draggable(true);
	    });
		
		gPieceArray[6].on('dragend', function() {
		this.draggable(false);
		gPieceArray[5].draggable(true);
	    });
		
		gPieceArray[5].on('dragend', function() {
		this.draggable(false);
		gPieceArray[4].draggable(true);
	    });
		
		gPieceArray[4].on('dragend', function() {
		this.draggable(false);
		gPieceArray[3].draggable(true);
	    });
		
		gPieceArray[3].on('dragend', function() {
		this.draggable(false);
		gPieceArray[2].draggable(true);
	    });
		
		gPieceArray[2].on('dragend', function() {
		this.draggable(false);
		gPieceArray[1].draggable(true);
	    });
		
		gPieceArray[1].on('dragend', function() {
		this.draggable(false);
		gPieceArray[0].draggable(true);
	    });
	
	/*
	for(var i = 17; i > 0; i--) {
	    gPieceArray[i].on('dragend', function() {
		this.draggable(false);
		gPieceArray[i-1].draggable(true);
	    });
	    //gPieceArray[t].draggable(true);
	}
	*/
	
	//var piecePlease = gPieceArray[5].getPiece;
	
	//piecePlease.draggable(true);
	
	
	
	
}
