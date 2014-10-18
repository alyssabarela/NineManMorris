/*
This class will serve as the game pieces, the pieces that the user (and eventually the AI) will move to play the game
*/

function GamePiece(x, y, fill, draggable, layer, space_array, moved, gameBoard){

    this.gameBoard = gameBoard;

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

    this.circle.gameBoard = this.gameBoard;
	var space = 0;
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
						this.moved = 1;
						removable = false;
						space = i;
						
					}
									

				}
				
			}
			
			if(this.moved == 0){
                thisObj.reset_to_previous_position();
			} else {
                thisObj.set_previous_position_to_this_one(new_space);
                this.on_board = true;
            }
			
			if(this.gameBoard.in_phase_2()){
				this.gameBoard.setTurn("White");
			}
        } else {
            legal_space = thisObj.get_legal_space_I_am_on();
            if(legal_space) {
                thisObj.set_previous_position_to_this_one(legal_space);
                if(this.gameBoard.whos_turn_is_it() == "White") {
                    legal_space.occupied = "white";
                    this.gameBoard.setTurn("Red");
                } else {
                    legal_space.occupied = "red";
                    this.gameBoard.setTurn("White");
                }
            } else {
                thisObj.reset_to_previous_position();
            }
        }
        
        layer.draw();
        //TODO figure out what I did to make any row of pieces be
        //     recognized as a mill
        //gameBoard.checkSpaces();
        console.log("setting space to ", space);
        thisObj.space = space;
        thisObj.removable = removable;
    });

    layer.add(this.circle);
    
    this.circle.on('click', function(){
        if(thisObj.removable === true){
            if(this.moved === 1){
                console.log("attempting to remove");
                //is it in a mill?  if not go ahead

                this.destroy();
                thisObj.space_array[thisObj.space].occupied = false;
                layer.draw();
            }
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
            return this.space_array[i];
        }
    }
    return false;
}

GamePiece.prototype.set_previous_position_to_this_one = function(new_current_space) {
    if(this.current_space) {
        this.current_space.occupied = false;
    }
    this.current_space = new_current_space;
    this.current_space.occupied = true;
    this.circle.x(this.current_space.circle.getAbsolutePosition().x);
    this.circle.y(this.current_space.circle.getAbsolutePosition().y);
    this.circle.previous.x = this.circle.getAbsolutePosition().x;
    this.circle.previous.y = this.circle.getAbsolutePosition().y;
}

GamePiece.prototype.reset_to_previous_position = function() {
    this.circle.x(this.circle.previous.x);
    this.circle.y(this.circle.previous.y);
}
