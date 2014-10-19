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
    this.mills = [{space_indexes: [ 0,  3,  5], recognized:false},
                  {space_indexes: [ 8, 11, 13], recognized:false},
                  {space_indexes: [16, 19, 21], recognized:false},
                  {space_indexes: [18, 20, 23], recognized:false},
                  {space_indexes: [10, 12, 15], recognized:false},
                  {space_indexes: [ 2,  4,  7], recognized:false},
                  {space_indexes: [ 0,  1,  2], recognized:false},
                  {space_indexes: [ 8,  9, 10], recognized:false},
                  {space_indexes: [16, 17, 18], recognized:false},
                  {space_indexes: [21, 22, 23], recognized:false},
                  {space_indexes: [13, 14, 15], recognized:false},
                  {space_indexes: [ 5,  6,  7], recognized:false},
                  {space_indexes: [ 3, 11, 19], recognized:false},
                  {space_indexes: [20, 12,  4], recognized:false},
                  {space_indexes: [ 1,  9, 17], recognized:false},
                  {space_indexes: [22, 14,  6], recognized:false}];
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
                        {x:           get_game_space_coordinate(x_position),
                         y:           get_game_space_coordinate(y_position),
                         radius:      game_space_radius,
                         gameBoard:   this.game_board,
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

GameBoard.prototype.check_for_mills = function() {
    game_board = this;
    this.mills.forEach(function(mill) {
        occupied = (game_board.gameSpaceArray[mill.space_indexes[0]].occupied != false &&
                    game_board.gameSpaceArray[mill.space_indexes[1]].occupied != false &&
                    game_board.gameSpaceArray[mill.space_indexes[2]].occupied != false);
        is_mill = (occupied &&
                  (game_board.gameSpaceArray[mill.space_indexes[0]].occupied ==
                   game_board.gameSpaceArray[mill.space_indexes[1]].occupied) &&
                  (game_board.gameSpaceArray[mill.space_indexes[1]].occupied ==
                   game_board.gameSpaceArray[mill.space_indexes[2]].occupied))
        if(is_mill) {
            if(!mill.recognized) {
                mill.recognized = true;
                player_with_mill = game_board.gameSpaceArray[mill.space_indexes[0]].occupied;
                alert(player_with_mill + " can remove their opponent's piece!");
                if(player_with_mill == "white") {
                    gameBoard.set_pieces_removeable("red");
                } else if(player_with_mill == "red") {
                    gameBoard.set_pieces_removeable("white");
                } else {
                    console.error("can't remove piece player " +
                                  player_with_mill +
                                  " isn't recognized.");
                }
            }
        }
    });
}

GameBoard.prototype.set_pieces_removeable = function(color){
	if(color == "red"){
        mod_val = 0;
	} else if(color == "white"){
        mod_val = 1;
	} else{
		console.error("Invalid player color: " + player);
        return;
	}
	
	for(var i = 0; i < this.gamePieceArray.length; i++){
        if(this.gamePieceArray[i].on_board() && i%2 == mod_val) {
            this.gamePieceArray[i].removeable = true;
        }
	}
}

GameBoard.prototype.set_all_unremoveable = function() {
	for(var i = 0; i < this.gamePieceArray.length; i++){
        this.gamePieceArray[i].removeable = false;
	}
}

GameBoard.prototype.unrecognize_if_was_mill = function(empty_game_space_index) {
    game_board = this;
    this.gameSpaceArray.forEach(function(game_space) {
        empty_game_space = game_board.gameSpaceArray[empty_game_space_index];
        if(game_space.circle == empty_game_space.circle) {
            game_board.mills.forEach(function(mill) {
                mill.space_indexes.forEach(function(space_index) {
                    if(space_index == empty_game_space_index) {
                        mill.recognized = false;
                    }
                });
            });
        }
    });
}

GameBoard.prototype.hasWinner = function(){
    return false;
}

GameBoard.prototype.whos_turn_is_it = function() {
    return this.player_whose_turn_it_is;
}

GameBoard.prototype.setTurn = function(player_whose_turn_it_is){
    this.player_whose_turn_it_is = player_whose_turn_it_is
	if(player_whose_turn_it_is == "Red"){
        mod_val = 0;
	}
	else if(player_whose_turn_it_is == "White"){
        mod_val = 1;
	}
	else{
		alert("Invalid player color: " + player);
        return;
	}
	
	for(var i = 0; i < this.gamePieceArray.length; i++){
	
		if(i%2 == mod_val){
			this.gamePieceArray[i].setDraggable(true);
		}
		else{
			this.gamePieceArray[i].setDraggable(false);
		}
	
	}
}

GameBoard.prototype.in_phase_1 = function() {
    return !this.in_phase_2() && !this.in_phase_3();
}

GameBoard.prototype.in_phase_2 = function() {
    for(var i = 0; i < this.gamePieceArray.length; i++) {
        if(!this.gamePieceArray[i].on_board()) return false;
    }
    return true;
}

GameBoard.prototype.in_phase_3 = function() {
    return false;
}
