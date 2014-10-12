function GameSpace(config){
    config.fill = 'black';
    this.circle =  new Kinetic.Circle(config);
	this.occupied = false;
    config.gameBoard.add(this.circle);
}
