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

    this.decrementer = new Decrementer();
    this.ai = new ArtificialIntelligence(this);
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

    this.space_neighbors = new Array();
    this.space_neighbors[ 0] = [         1,  3];
    this.space_neighbors[ 1] = [     0,  9,  2];
    this.space_neighbors[ 2] = [         1,  4];
    this.space_neighbors[ 3] = [     0, 11,  5];
    this.space_neighbors[ 4] = [     2, 12,  7];
    this.space_neighbors[ 5] = [         3,  6];
    this.space_neighbors[ 6] = [     5, 14,  7];
    this.space_neighbors[ 7] = [         4,  6];
    this.space_neighbors[ 8] = [         9, 11];
    this.space_neighbors[ 9] = [ 1,  8, 10, 17];
    this.space_neighbors[10] = [         9, 12];
    this.space_neighbors[11] = [ 3,  8, 13, 19];
    this.space_neighbors[12] = [ 4, 10, 15, 20];
    this.space_neighbors[13] = [        11, 14];
    this.space_neighbors[14] = [ 6, 13, 15, 22];
    this.space_neighbors[15] = [        12, 14];
    this.space_neighbors[16] = [        17, 19];
    this.space_neighbors[17] = [     9, 16, 18];
    this.space_neighbors[18] = [        17, 20];
    this.space_neighbors[19] = [    11, 16, 21];
    this.space_neighbors[20] = [    12, 18, 23];
    this.space_neighbors[21] = [        19, 22];
    this.space_neighbors[22] = [    14, 21, 23];
    this.space_neighbors[23] = [        20, 22];

    var gameBoard = this;
    $('#myform :checkbox').click(function() {
        gameBoard.toggle_ai();
    });

}

GameBoard.prototype.has_3_spaces_or_less = function(color) {
    return this.decrementer.hasThreeOrLess(color);
}

GameBoard.prototype.neighbors = function(space_index1, space_index2) {  //space_index1 moving from, space_index2 where i' moving too

    return this.space_neighbors[space_index1].indexOf(space_index2) > -1;
}
    
GameBoard.prototype.drawBoxes = function() {
    i = 0;
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

        this.drawSpaces(box_xy_offset, box_side_length, i);
        i += 8;
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

GameBoard.prototype.drawSpaces = function(box_xy_offset, box_side_length, i) {
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
                        {x:           get_game_space_coordinate(x_position),
                         y:           get_game_space_coordinate(y_position),
                         radius:      game_space_radius,
                         gameBoard:   this.game_board,
                         spaceNumber: i++}));
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
    var piece_index = 0;
    for(var t = 0; t < number_of_player_pieces; t++) {
        this.gamePieceArray.push(new GamePiece(red_position(this.x, this.sideLength, t),
                                               y_offset,
                                               'red',
                                               false,
                                               this.gameBoardLayer,
                                               this.gameSpaceArray,
                                               this,
                                               {piece_index: piece_index++}));

        this.gamePieceArray.push(new GamePiece(white_position(this.x, t),
                                               y_offset,
                                               'white',
                                               t==8,
                                               this.gameBoardLayer,
                                               this.gameSpaceArray,
                                               this,
                                               {piece_index: piece_index++}));
    }

    //set order of pieces for first phase of play
    for(var i = 17; i > 0; i--) {
        this.gamePieceArray[i].set_next(this.gamePieceArray[i - 1]);
    }
}

GameBoard.prototype.check_for_blocked_state = function(){
    //for each piece, get space they are on
    //are any of their neighbors free
    //if yes return false
    //if no continue to next piece
    var returnVal = true;
    game_board = this;
    var in_phase_2 = game_board.in_phase_2();
    var player = game_board.whos_turn_is_it();
    if(in_phase_2){
    this.gamePieceArray.forEach(function(piece){
        if(returnVal){
            if(piece.color != player){
                var space = piece.current_space;
                var spacenumber = space.spaceNumber;
                var neighbors = game_board.space_neighbors[spacenumber];
                for(var i = 0; i< neighbors.length; i++){
                    var neighbor = neighbors[i];
                    var occupied = game_board.gameSpaceArray[neighbor].occupied;
                    if(occupied === false)
                        returnVal = false;
            }
        }
        else
            return;
    }
    else{
        return;
    }
    });
}
else{
    returnVal = false;
}
if(returnVal)
game_board.set_win_message_for_blocked_state();
return returnVal;
}

GameBoard.prototype.set_win_message_for_blocked_state = function(){
    game_board = this;
                var winner = game_board.whos_turn_is_it();
                var loser = "";
                if(winner === "white"){
                    loser = "red";
                }
                else{
                    loser = "white";
                }
                game_board.update_status(loser + " is blocked, " + winner + " wins!");
}

GameBoard.prototype.check_for_mills = function() {
    game_board = this;
    var new_mill_count = 0;
    var player_with_mill = "";

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
                new_mill_count++;
                mill.recognized = true;
                player_with_mill = game_board.gameSpaceArray[mill.space_indexes[0]].occupied;
            }
        }
        
    });

    if(new_mill_count > 0) {
        if(player_with_mill == "white") {
            gameBoard.set_pieces_removeable("red", new_mill_count);
        } else if(player_with_mill == "red") {
            gameBoard.set_pieces_removeable("white", new_mill_count);
        } else {
            console.error("can't remove piece player " + player_with_mill + " isn't recognized.");
        }
        gameBoard.update_status(player_with_mill + " can remove their opponent's piece!");
        
    }
}

GameBoard.prototype.piece_is_in_mill = function(game_piece) {
    in_mill = false;
    game_space_array = this.gameSpaceArray;
    this.mills.forEach(function(mill) {
        if(mill.recognized && !in_mill) {
            mill.space_indexes.forEach(function(space_index) {
                if(space_index == game_space_array.indexOf(game_piece.current_space)) {
                    in_mill = true;
                }
            });
        }
    });
    return in_mill;
}

GameBoard.prototype.get_removeable_pieces = function(color) {
    pieces_in_mill = new Array();
    pieces_not_in_mill = new Array();
    game_board = this;

    this.gamePieceArray.forEach(function(game_piece) {
        if(game_piece.color == color) {
            if(!game_board.piece_is_in_mill(game_piece) && game_piece.on_board()) {
                pieces_not_in_mill.push(game_piece);
            } else {
                pieces_in_mill.push(game_piece);
            }
        }
    });

    if(pieces_not_in_mill.length > 0) {
        return pieces_not_in_mill;
    } else {
        return pieces_in_mill;
    }
}

GameBoard.prototype.set_pieces_removeable = function(color, number_of_pieces_to_remove) {
    this.number_of_pieces_to_remove = number_of_pieces_to_remove;
    this.get_removeable_pieces(color).forEach(function(game_piece) {
        if(game_piece.on_board() && game_piece.color == color) {
            game_piece.removeable = true;
        }
    });
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
	if(player_whose_turn_it_is != "red" && player_whose_turn_it_is != "white"){
		this.update_status("Invalid player color: " + player_whose_turn_it_is);
        return;
	}

    this.gamePieceArray.forEach(function(game_piece) {
        game_piece.setDraggable(game_piece.color == player_whose_turn_it_is);
    });
}

GameBoard.prototype.get_available_spaces = function() {
    this.availableSpaceArray  = new Array();
    if(this.in_phase_1() || this.in_phase_3()){
        for(var i = 0; i < this.gameSpaceArray.length; i++){
            if(this.gameSpaceArray[i].occupied == false){
                this.availableSpaceArray.push(i);
            }
        }
        return this.availableSpaceArray.toString();
    }
    for(var j = 0; j < 24; j++){
        if(this.gameSpaceArray[j].occupied == "red"){
            var arrayToCheckNeighbors = this.space_neighbors[j]
            for(var k = 0; k < arrayToCheckNeighbors.length; k++){
                //checks if a piece is red then needs to check the neighbors if it can move
                if(this.gameSpaceArray[arrayToCheckNeighbors[k]].occupied ==  false){

                    this.availableSpaceArray.push(arrayToCheckNeighbors[k]);
                }
            }

        }
    }      
   return this.availableSpaceArray.toString();  
}

GameBoard.prototype.in_phase_1 = function() {
    return !this.in_phase_2() && !this.in_phase_3();
}

GameBoard.prototype.in_phase_2 = function() {
    phase_2 = true;
    count = 0;
    this.gamePieceArray.forEach(function(game_piece) {
        count++;
        if(!game_piece.on_board()) phase_2 = false;
    });
    return phase_2;
}

GameBoard.prototype.in_phase_3 = function() {
    return false;
}

GameBoard.prototype.update_status = function (newMessage){
    $('#message').text(newMessage);
    active = this.ai.is_active();
    if(active){
        var status_type = this.get_status_type(message);
        if(status_type === 0){
            this.ai.your_turn();
        }
        else if(status_type === 1){
            this.ai.remove_opponents_piece();
        }
        else{
            console.error("Cannot properly update message");
        }
    }
}

GameBoard.prototype.get_status_type = function(message){
    var status = 0;
    if(message === "red's turn")
        status = 0;
    else if(message === "red can remove their opponent's piece!")
        status = 1;
    return status;
}

GameBoard.prototype.remove_piece = function(game_piece) {

    game_piece.circle.destroy();

    winner = this.decrementer.decrement(game_piece.color);

    this.gamePieceArray.splice(this.gamePieceArray.indexOf(game_piece), 1);
    this.unrecognize_if_was_mill(game_piece.space);
    this.gameSpaceArray[game_piece.space].occupied = false;

    this.set_all_unremoveable();

    this.number_of_pieces_to_remove--;

    if(winner) {
        this.update_status(winner + " wins!");
    } else if(this.number_of_pieces_to_remove <= 0) {
        this.update_status(game_piece.color + "'s turn");
    } else {
        this.set_pieces_removeable(game_piece.color, this.number_of_pieces_to_remove);
        this.update_status(this.opposite_color(game_piece.color) + " can remove another piece!");
    }

    this.gameBoardLayer.draw();
}

GameBoard.prototype.toggle_ai = function() {
    this.ai.toggle_active();
}

GameBoard.prototype.opposite_color = function(color) {
    opposite_color = {"red":"white", "white":"red"};
    return opposite_color[color];
}

GameBoard.prototype.move_AI_on_space = function(piece_index, space_index){

}

GameBoard.prototype.get_available_ai_pieces = function(){
    
}

GameBoard.prototype.get_next_unplaced_piece = function() {
    next_piece = false;
    this.gamePieceArray.forEach(function(game_piece) {
        var moved = game_piece.moved();
        // console.log(game_piece.moved());
        if(moved === 0) {
            next_piece = game_piece;
            console.log(next_piece);
        }
    });
    return next_piece;
}

GameBoard.prototype.place_piece = function(color, index) {
    if(color.match("^white$|^red$") &&
       index >= 0 && index <= 23    &&
       !this.gameSpaceArray[index].occupied) {
        piece_to_place = this.get_next_unplaced_piece();
    console.log(piece_to_place);
        if(piece_to_place && piece_to_place.get_color() == color) {
            game_space_circle = this.gameSpaceArray[index].circle;
            piece_to_place.circle.x(game_space_circle.x() + this.x);
            piece_to_place.circle.y(game_space_circle.y() + this.y);
            moved = piece_to_place.confirm_move();
            this.gameBoardLayer.draw();
            return moved;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

GameBoard.prototype.get_piece_on = function(index) {
    game_spaces = this.gameSpaceArray;
    game_pieces = this.gamePieceArray;
    found_game_piece = false;
    this.gamePieceArray.forEach(function(game_piece) {
        if(game_spaces.indexOf(game_piece.get_space()) == index) {
            found_game_piece = game_piece;
        }
    });
    return found_game_piece;
}
