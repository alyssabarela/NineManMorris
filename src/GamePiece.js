/*
** This class will serve as the game pieces, the pieces that the user (and eventually the AI) will move to play the game
**
*/


function GamePiece(xPos, yPos, radius, fill, stroke, strokeWidth, draggable, layer){

	function writeMessage(message) {
        text.text(message);
        layer.draw();
    }
	
	var text = new Kinetic.Text({
        x: 200,
        y: 250,
        fontFamily: 'Calibri',
        fontSize: 24,
        text: '',
        fill: 'black'
      });

	var game_piece = new Kinetic.Circle({
		x: xPos,
		y: yPos,
		radius: radius,
		fill: fill,
		stroke: stroke,
		strokeWidth: strokeWidth,
		draggable: draggable
	});
	
	game_piece.on('dragstart', function() {
        writeMessage('dragstart');
    });
	game_piece.on('dragend', function() {
        writeMessage('dragend');
    });
	
	layer.add(text);
	layer.add(game_piece);
}
