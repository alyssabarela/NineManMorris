
function GameBoard(xLoc, yLoc, box_lengths){

	this.x = xLoc;
	this.y = yLoc;
    this.box_lengths = box_lengths;
	this.sideLength = box_lengths.biggest_side;
    this.number_of_boxes = 3;

	var gamePieceArray = new Array();
	/*
	The game board is built out of KinetcJS primitives, namely:
	3 successively smaller boxes, each on top of the other
	1 horizontal line crossing the middle of the board, covered
	by the smallest box.
	1 vertical line crossing the middle of the board, covered
	by the smallest box.
	24 game_spaces on the corners and midpoints of the sides of each box.

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
    for(var box_length in this.box_lengths) {
        console.log(box_length);

        var box_side_length = this.box_lengths[box_length];
        var box_xy_offset = (this.box_lengths["biggest_side"] - box_side_length)/2;

        console.log("xy offset = " + box_xy_offset);

        var box = new Kinetic.Rect({
            x: box_xy_offset,
            y: box_xy_offset,
            width: box_side_length,
            height: box_side_length,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 4
        });
    }


	//The outer for-loop draws each box and the the vertical and
	//horizontal lines.
	for(var i = 0; i < this.number_of_boxes; i++) {
		box_xy_offset = i * 50;
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
	//x or y position for each of the 24 game_spaces
	var get_game_space_coordinate = function(j_or_k) {
		return box_xy_offset + j_or_k * .5 * box_side_length;
	}

	//This for-loop draws the 24 game_spaces
	//j helps determine the x position of the game_space
	//k helps determine the y position of the game_space
    number_of_game_space_columns = 3;
    number_of_game_space_rows    = 3;
    missing_game_space_coordinates = {x:1, y:1};
    game_space_radius            = 10;

    //Draw game spaces in double for loop
	for(var j = 0; j < number_of_game_space_columns; j++) {
		for(var k = 0; k < number_of_game_space_rows; k++) {
            //If this game_space isn't our missing game_space, draw it.
            //Basically it skips the center game_space.
			if(j != missing_game_space_coordinates.x || k != missing_game_space_coordinates.y) {
				var game_space = new Kinetic.Circle({
					x: get_game_space_coordinate(j),
					y: get_game_space_coordinate(k),
					radius: game_space_radius,
					fill: 'black'
				});
				game_board.add(game_space);
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
		
		gPieceArray.push(game_piece);
		layer.add(game_piece);
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
}
