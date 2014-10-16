/*
This class will serve as the game pieces, the pieces that the user (and eventually the AI) will move to play the game
*/

function GamePiece(x, y, fill, draggable, layer, sArray, moved, gameBoard){

    this.gameBoard = gameBoard;

    this.circle = new Kinetic.Circle({x: x,
                                      y: y,
                                      radius: 20,
                                      fill: fill,
                                      stroke: 'black',
                                      strokeWidth: 2,
                                      draggable: draggable});
                                      
    this.circle.previous = {x: x, y: y};                                  
                                      
    this.circle.next = false;

    this.circle.gameBoard = this.gameBoard;

    this.circle.on('dragend', function() {
	
	
    
        this.moved = 0;
        this.removable = false;
		
		if(this.gameBoard.in_phase_1()){
		
			for (var i = 0; i < sArray.length; i++) {
			
				if (this.intersects({x:sArray[i].circle.getAbsolutePosition().x, y:sArray[i].circle.getAbsolutePosition().y}))  {
					if(!sArray[i].occupied){
						this.x(sArray[i].circle.getAbsolutePosition().x);
						this.y(sArray[i].circle.getAbsolutePosition().y);
						this.draggable(false);
						if(this.next) {
							this.next.draggable(true);
						}
						//need to change this to the GamePiece object instead of a boolean value so that the game space object knows which piece is occupying it, but had trouble getting it to work
						sArray[i].occupied = fill;
						this.moved = 1;
						this.removable = true;
						this.space = i;

					}
									

				}
				
			}
			
			if(this.moved == 0){
				this.x(this.previous.x);
				this.y(this.previous.y);
			}
				
			layer.draw();
			gameBoard.checkSpaces();
			
			if(this.gameBoard.in_phase_2()){
				this.gameBoard.setTurn("White");
			}
		}
		else if(this.gameBoard.in_phase_2()){
			console.log("We're in phase 2");
		}
		else if(this.gameBoard.in_phase_3()){
			console.log("We're in phase 3");
		}
        
        

        console.log(this.gameBoard.in_phase_2());
    });
    

    layer.add(this.circle);
    //Commented out this code because whenever a piece moves
    //it is destroyed.
    /*
    this.circle.on('click', function(){
           if(this.removable === true){
           if(this.moved === 1){
        alert("attempting to remove");
        //is it in a mill?  if not go ahead

        this.destroy();
        sArray[this.space].occupied = false;
        layer.draw();
        }
    }
    });
    */

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

GamePiece.prototype.moved = function() {
    return this.circle.moved;
}
