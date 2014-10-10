function GameBoard(xLoc, yLoc, box_lengths) {
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
        var box_side_length = this.box_lengths[box_length];
        var box_xy_offset = (this.box_lengths["biggest_side"] - box_side_length)/2;

        var box = new Kinetic.Rect({
            x: box_xy_offset,
            y: box_xy_offset,
            width: box_side_length,
            height: box_side_length,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 4
        });

        if(box_length == "smallest_side") {
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
    number_of_rows_cols = 3;
    center_game_space   = {x:1, y:1};
    game_space_radius   = 10;

	//This function helps the for-loop below determine the
	//x or y position for each of the 24 game_spaces
	var get_game_space_coordinate = function(x_or_y_position) {
        space_between_rows_cols = box_side_length/(number_of_rows_cols - 1);
		return box_xy_offset + x_or_y_position * space_between_rows_cols;
	}

	//This for-loop draws the 24 game_spaces
    //There is no center game space, so none is drawn
	for(var x_position = 0; x_position < number_of_rows_cols; x_position++) {
		for(var y_position = 0; y_position < number_of_rows_cols; y_position++) {
			if(x_position != center_game_space.x || y_position != center_game_space.y) {
		        game_board.add(
                    new Kinetic.Circle(
                        {x:      get_game_space_coordinate(x_position),
                         y:      get_game_space_coordinate(y_position),
                         radius: game_space_radius,
                         fill:   'black'}));
			}
		}
	}

}

GameBoard.prototype.drawGamePieces = function(layer, gPieceArray) {
    number_of_player_pieces = 9;
    y_offset = this.y - 50;
    game_piece_offset = 15;

    //helper functions for piece-creation for-loop below
    red_position = function(x, sideLength, t) {
        return x + sideLength - game_piece_offset * t;
    }
    white_position = function(x, t) {
        return x + game_piece_offset * t;
    }

	//create all game pieces	
	for(var t = 0; t < number_of_player_pieces; t++) {
		gPieceArray.push(new GamePiece(red_position(this.x, this.sideLength, t),
                                       y_offset,
                                       'red',
                                       false,
                                       layer));

		gPieceArray.push(new GamePiece(white_position(this.x, t),
                                       y_offset,
                                       'white',
                                       t==8,
                                       layer));
	}

    //set order of pieces for first phase of play
    for(var i = 17; i > 0; i--) {
		gPieceArray[i].set_next(gPieceArray[i - 1]);
    }
}
