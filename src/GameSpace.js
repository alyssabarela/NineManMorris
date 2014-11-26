function GameSpace(config){
    config.fill = 'black';
    this.x = config.x;
    this.y = config.y;
    this.circle =  new Kinetic.Circle(config);
    this.occupied = false;
    this.game_piece = false;
    this.spaceNumber = config.spaceNumber;
    config.gameBoard.add(this.circle);
}

GameSpace.prototype.set_occupied = function(game_piece) {
    if(game_piece) {
        this.occupied = game_piece.get_color();
        this.game_piece = game_piece;
    } else {
        this.occupied = false;
        this.piece = false;
    }
}
