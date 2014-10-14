function GameSpace(config){
    config.fill = 'black';
    this.x = config.x;
    this.y = config.y;
    this.circle =  new Kinetic.Circle(config);
	this.occupied = false;
    config.gameBoard.add(this.circle);
}
