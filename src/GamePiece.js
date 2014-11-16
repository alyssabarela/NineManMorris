/*
This class will serve as the game pieces, the pieces that the user (and eventually the AI) will move to play the game
*/

function GamePiece(x, y, fill, draggable, layer, space_array, gameBoard, config){
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

    this.circle.gameBoard = this.gameBoard;
	var space_index = 0;
	var removable = false;
	var thisObj = this;
    this.circle.on('dragend', function() {
        this.moved = 0;

        new_space = null;
		if(this.gameBoard.in_phase_1()) {
			for (var i = 0; i < space_array.length; i++) {
			
				if (this.intersects({x:space_array[i].circle.getAbsolutePosition().x,
                                     y:space_array[i].circle.getAbsolutePosition().y}))  {
					if(!space_array[i].occupied){
						this.x(space_array[i].circle.getAbsolutePosition().x);
						this.y(space_array[i].circle.getAbsolutePosition().y);
						this.draggable(false);
						if(this.next) {
							this.next.draggable(true);
						}
						//need to change this to the GamePiece object instead of a boolean value
                        //so that the game space object knows which piece is occupying it,
                        //but had trouble getting it to work
                        new_space = space_array[i];
						space_array[i].occupied = fill;
                        if(fill == 'white')
                            this.gameBoard.updateMessage("red's turn")
                        if(fill == 'red')
                            this.gameBoard.updateMessage("white's turn")
						this.moved = 1;
						removable = false;
						space = i;
						
					}
									

				}
				
			}
			
			if(this.moved == 0){
                thisObj.reset_to_previous_position();
			} else {
                thisObj.set_previous_position_to_this_one(new_space, thisObj.color);
                this.on_board = true;
            }
			
			if(this.gameBoard.in_phase_2()){
				this.gameBoard.setTurn("white");
                this.gameBoard.updateMessage("white's turn");

			}
        } else {
            legal_space = thisObj.get_legal_space_I_am_on();
            if(legal_space) {
                if(this.gameBoard.whos_turn_is_it() == "white") {
                    thisObj.set_previous_position_to_this_one(legal_space, "white");
                    legal_space.occupied = "white";
                    this.gameBoard.setTurn("red");
                    this.gameBoard.updateMessage("red's turn");
                } else {
                    thisObj.set_previous_position_to_this_one(legal_space, "red");
                    legal_space.occupied = "red";
                    this.gameBoard.setTurn("white");
                    this.gameBoard.updateMessage("white's turn");
                }
            } else {
                thisObj.reset_to_previous_position();
            }
        }
        
        layer.draw();
        thisObj.gameBoard.check_for_mills();
        thisObj.space = space;
        thisObj.removable = removable;
    });

    layer.add(this.circle);
    
    this.circle.on('click', function(){
        console.log(thisObj.index);
        if(thisObj.removeable) {
            thisObj.gameBoard.remove_piece(thisObj);
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
                if(this.gameBoard.neighbors(this.old_space.spaceNumber, i)) {
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

    this.current_space = new_current_space;
    this.old_space = this.current_space
    this.current_space.occupied = color;
    this.circle.x(this.current_space.circle.getAbsolutePosition().x);
    this.circle.y(this.current_space.circle.getAbsolutePosition().y);
    this.circle.previous.x = this.circle.getAbsolutePosition().x;
    this.circle.previous.y = this.circle.getAbsolutePosition().y;
}

GamePiece.prototype.reset_to_previous_position = function() {
    this.circle.x(this.circle.previous.x);
    this.circle.y(this.circle.previous.y);
}
