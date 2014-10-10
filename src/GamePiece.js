/*
This class will serve as the game pieces, the pieces that the user (and eventually the AI) will move to play the game
*/

function GamePiece(x, y, fill, draggable, layer){
	this.circle = new Kinetic.Circle({x: x,
                                      y: y,
                                      radius: 20,
                                      fill: fill,
                                      stroke: 'black',
                                      strokeWidth: 2,
                                      draggable: draggable});
    this.circle.next = false;

    this.circle.on('dragend', function() {
            this.draggable(false);
            if(this.next) {
                this.next.draggable(true);
            }
    });

    layer.add(this.circle);
}

GamePiece.prototype.set_next = function(next) {
    this.circle.next = next;
}

GamePiece.prototype.draggable = function(boolean_value) {
    this.circle.draggable(boolean_value);
}
