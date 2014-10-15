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
	this.mill = [];
	//[spaceA, spaceB, spaceC, occupied, recognized]
	this.mill[0] = [0, 3, 5, false, false];
	this.mill[1] = [8, 11, 13, false, false];
	this.mill[2] =[16, 19, 21, false, false];
	this.mill[3] = [18, 20, 23, false, false];
	this.mill[4] = [10, 12, 15, false, false];
	this.mill[5] = [2, 4, 7, false, false];
	this.mill[6] = [0, 1, 2, false, false];
	this.mill[7] = [8, 9, 10, false, false];
	this.mill[8] = [16, 17, 18, false, false];
	this.mill[9] = [21, 22, 23, false, false];
	this.mill[10] = [13, 14, 15, false, false];
	this.mill[11] = [5, 6, 7, false, false];
	this.mill[12] = [3, 11, 19, false, false];
	this.mill[13] = [20, 12, 4, false, false];
	this.mill[14] = [1, 9, 17, false, false];
	this.mill[15] = [22, 14, 7, false, false];

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
    var i = 0;
	for(var x_position = 0; x_position < number_of_rows_cols; x_position++) {
		for(var y_position = 0; y_position < number_of_rows_cols; y_position++) {
			if(x_position != center_game_space.x || y_position != center_game_space.y) {
                    this.gameSpaceArray.push(new GameSpace(
                        {x:         get_game_space_coordinate(x_position),
                         y:         get_game_space_coordinate(y_position),
                         radius:    game_space_radius,
                         gameBoard: this.game_board,
                     	 spaceNumber: i}));
			}
			i++;
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
											   this.gameSpaceArray,
											   0, this));

		this.gamePieceArray.push(new GamePiece(white_position(this.x, t),
                                               y_offset,
                                               'white',
                                               t==8,
                                               this.gameBoardLayer,
											   this.gameSpaceArray,
											   0, this));
	}

    //set order of pieces for first phase of play
    for(var i = 17; i > 0; i--) {
		this.gamePieceArray[i].set_next(this.gamePieceArray[i - 1]);
    }
}

GameBoard.prototype.checkSpaces = function(){

	for(var m = 0; m < this.mill.length; m++){
		var thisMill = this.mill[m];
		if(thisMill[3] === false 
			&& this.gameSpaceArray[thisMill[0]].occupied === this.gameSpaceArray[thisMill[1]].occupied
			&& this.gameSpaceArray[thisMill[0]].occupied === this.gameSpaceArray[thisMill[2]].occupied){
				thisMill[3] = this.gameSpaceArray[thisMill[0]].occupied;
		}// end of if
		if(thisMill[3] !== false && thisMill[4] === false){
			//alert(thisMill[3]);
			thisMill[4] = true;
			//get gamepiece on spaces in mill
			for(var i = 0; i< this.gamePieceArray.length; i++){
				console.log(this.gamePieceArray[i]);
				if(this.gamePieceArray[i].space === thisMill[0] || this.gamePieceArray[i].space === thisMill[1] || this.gamePieceArray[i].space === thisMill[2]){
					this.gamePieceArray[i].setInMill();
					alert("true");
				}
			}
			//need to set each gamepiece that is within this mill to removable false;
			//this is where the user should be able to remove an opponents piece (one that is NOT in a mill!)
			alert(thisMill[3] + " - you may now remove one of the opponents pieces!");
			this.removePiece();

		}
	}//end for

}//end checkSpaces

GameBoard.prototype.removePiece = function(){
	
	//check if where user clicks intersects with a current game piece
	//if so, check if that piece resides in a mill
	//if not, go ahead and delete that piece completely
	//if so, notify the user and tell them to select another piece
	//if the user clicks somewhere outside of a gamepiece, do nothing
}

GameBoard.prototype.hasWinner = function(){
	return false;
}
