/*
This class will serve as the game pieces, the pieces that the user (and eventually the AI) will move to play the game
*/

function GamePiece(x, y, fill, draggable, layer, space_array, gameBoard, config){
    this.current_space = false;
    this.index = config.piece_index;
    this.gameBoard = gameBoard;
    this.color = fill;

    this.circle = new Kinetic.Circle({x: x,
                                      y: y,
                                      radius: 20,
                                      fill: fill,
                                      stroke: 'black',
                                      strokeWidth: 2,
                                      draggable: draggable});
                                      
    this.circle.previous = {x: x, y: y};                                  

    this.space_array = space_array;
                                      
    this.circle.next = false;

    this.circle.moved = 0;
    this.circle.on_board = false;
    this.turn = "";
    this.circle.gameBoard = this.gameBoard;
	var thisObj = this;
    var space_array = this.space_array;
    this.circle.on('dragend', function() {thisObj.confirm_move();});

    layer.add(this.circle);
    
    this.circle.on('click', function() {
        var bool = thisObj.gameBoard.remove_piece(thisObj);
        if(thisObj.get_color() == "red" && thisObj.gameBoard.ai_is_active()) {
            thisObj.gameBoard.update_status("white removed a piece");
            thisObj.gameBoard.update_status("white's turn");
            thisObj.gameBoard.setTurn("white");
        }

    });
}

GamePiece.prototype.setDraggable = function(draggable){
	this.circle.draggable(draggable);
}

GamePiece.prototype.set_next = function(next) {
    this.circle.next = next;
}

GamePiece.prototype.draggable = function(boolean_value) {
    this.circle.draggable(boolean_value);
}

GamePiece.prototype.setInMill = function(){
    this.removable = false;   
}
GamePiece.prototype.setSpace = function(space_value){
    this.space = space_value;    
}

GamePiece.prototype.moved = function() {
    return this.circle.moved;
}

GamePiece.prototype.on_board = function() {
    return this.circle.on_board;
}

GamePiece.prototype.get_legal_space_I_am_on = function() {
    for (var i = 0; i < this.space_array.length; i++) {
        if(this.circle.intersects({x: this.space_array[i].circle.getAbsolutePosition().x,
                                   y: this.space_array[i].circle.getAbsolutePosition().y}) &&
                                   !this.space_array[i].occupied) {
            if(!this.gameBoard.has_3_spaces_or_less(this.color)) {
                var are_we_neighbors = this.gameBoard.neighbors(this.old_space.spaceNumber, i);
                if(are_we_neighbors) {
                    return this.space_array[i];
                } else {
                    return false;
                }
            } else {
                return this.space_array[i];
            }
        }
    }
    return false;
}

GamePiece.prototype.set_previous_position_to_this_one = function(new_current_space, color) {
    if(this.current_space) {
        this.current_space.occupied = false;
        this.gameBoard.unrecognize_if_was_mill(this.current_space.spaceNumber);
    }

    if(this.old_space) {
        this.old_space.occupied = false;
        old_space_index = this.gameBoard.gameSpaceArray.indexOf(this.old_space);
        this.gameBoard.unrecognize_if_was_mill(old_space_index);
    }

    this.current_space = new_current_space;
    this.old_space = this.current_space
    this.current_space.occupied = color;
    this.circle.x(this.current_space.circle.getAbsolutePosition().x);
    this.circle.y(this.current_space.circle.getAbsolutePosition().y);
    this.circle.previous.x = this.circle.getAbsolutePosition().x;
    this.circle.previous.y = this.circle.getAbsolutePosition().y;
    this.space = this.gameBoard.gamePieceArray.indexOf(this.current_space);
}

GamePiece.prototype.reset_to_previous_position = function() {
    this.circle.x(this.circle.previous.x);
    this.circle.y(this.circle.previous.y);
}

GamePiece.prototype.get_color = function() {
    return this.color;
}

GamePiece.prototype.confirm_move = function() {
    return_value = false;
    space_array = this.gameBoard.gameSpaceArray;
    layer = this.gameBoard.gameBoardLayer;
    circle = this.circle;
    fill = this.color;
    circle.moved = 0;
    new_space = null;
    status_update = "error, status not properly updated in game_piece.confirm_move()";

    if(circle.gameBoard.in_phase_1()) {
        for (var i = 0; i < space_array.length; i++) {
        
            if (circle.intersects({x:space_array[i].circle.getAbsolutePosition().x,
                                 y:space_array[i].circle.getAbsolutePosition().y}))  {
                if(!space_array[i].occupied){
                    circle.x(space_array[i].circle.getAbsolutePosition().x);
                    circle.y(space_array[i].circle.getAbsolutePosition().y);
                    circle.draggable(false);
                    if(circle.next) {
                        circle.next.draggable(true);
                    }
                    new_space = space_array[i];

                    space_array[i].occupied = fill;
                    if(fill == 'white'){
                        circle.turn = "red";
                    }
                    if(fill == 'red'){
                        circle.turn = "white";
                    }
                    circle.moved = 1;
                    var space = i;
                }
            }
        }
        
        if(circle.moved == 0){
            this.reset_to_previous_position();
            status_update = fill + "'s turn";
            circle.turn = fill;
        } else {
            this.current_space = new_space;
            this.set_previous_position_to_this_one(new_space, this.color);
            circle.on_board = true;
            return_value = true;
            status_update = circle.gameBoard.opposite_color(fill) + "'s turn";
        }
        
        if(circle.gameBoard.in_phase_2()){
            circle.turn = "white";
            status_update = "white's turn";
        }
        circle.gameBoard.setTurn(circle.turn);
    } else {
        legal_space = this.get_legal_space_I_am_on();
        player = circle.gameBoard.whos_turn_is_it();
        if(legal_space && player.match("^white$|^red$")) {
            this.set_previous_position_to_this_one(legal_space, player);
            legal_space.set_occupied(this);
            status_update = circle.gameBoard.opposite_color(player) + "'s turn";
            this.current_space = legal_space;
            return_value = true;
            circle.gameBoard.setTurn(circle.turn);
        } else {
            this.reset_to_previous_position();
            status_update = (player) + "'s turn";
        }
    }

    layer.draw();
    if(!this.gameBoard.check_for_mills()) {
        circle.gameBoard.update_status(status_update);
    }
    else{
    }
    this.space = space;
    this.removable = false;
    this.gameBoard.check_for_blocked_state();

    return return_value;
}

GamePiece.prototype.get_space = function() {
    return this.current_space;
}
