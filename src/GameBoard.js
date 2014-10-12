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

function GameBoard(x, y, box_lengths) {
	this.x = x;
	this.y = y;
    this.number_of_boxes = 3;
    this.box_lengths     = box_lengths;
	this.sideLength      = box_lengths.biggest_side;

	this.gamePieceArray  = new Array();
	this.gameSpaceArray  = new Array();
	
	this.stageContainer = new Kinetic.Stage({
		container: 'container',
		width: 500,
		height: 600
	});
		
	this.game_board = new Kinetic.Group({
		x: this.x,
		y: this.y
	});
	
	this.gameBoardLayer = new Kinetic.Layer();
	
	this.drawBoxes();
	
	this.gameBoardLayer.add(this.game_board);
	
	this.drawGamePieces();
	
	this.stageContainer.add(this.gameBoardLayer);

}
	
GameBoard.prototype.drawBoxes = function() {
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
            this.drawLines(this.game_board);
        }

        this.game_board.add(box);

        this.drawSpaces(box_xy_offset, box_side_length);
    }
}

GameBoard.prototype.drawLines = function() {
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

	this.game_board.add(horizontal_line);
	this.game_board.add(vertical_line);
}

GameBoard.prototype.drawSpaces = function(box_xy_offset, box_side_length) {
    number_of_rows_cols = 3;
    center_game_space   = {x:1, y:1};
    game_space_radius   = 10;

	//This function helps the for-loop below determine the
	//x or y position for each of the 24 game_spaces
	var get_game_space_coordinate = function(x_or_y_position) {
        space_between_rows_cols = box_side_length/(number_of_rows_cols - 1);
		return box_xy_offset + x_or_y_position * space_between_rows_cols;
	}

	//Draw the 24 game_spaces
    //There is no center game space, so none is drawn
	for(var x_position = 0; x_position < number_of_rows_cols; x_position++) {
		for(var y_position = 0; y_position < number_of_rows_cols; y_position++) {
			if(x_position != center_game_space.x || y_position != center_game_space.y) {
                    this.gameSpaceArray.push(new GameSpace(
                        {x:         get_game_space_coordinate(x_position),
                         y:         get_game_space_coordinate(y_position),
                         radius:    game_space_radius,
                         gameBoard: this.game_board}));
			}
		}
	}

}

GameBoard.prototype.drawGamePieces = function() {
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
		this.gamePieceArray.push(new GamePiece(red_position(this.x, this.sideLength, t),
                                               y_offset,
                                               'red',
                                               false,
                                               this.gameBoardLayer,
											   this.gameSpaceArray));

		this.gamePieceArray.push(new GamePiece(white_position(this.x, t),
                                               y_offset,
                                               'white',
                                               t==8,
                                               this.gameBoardLayer,
											   this.gameSpaceArray));
	}

    //set order of pieces for first phase of play
    for(var i = 17; i > 0; i--) {
		this.gamePieceArray[i].set_next(this.gamePieceArray[i - 1]);
    }
}
