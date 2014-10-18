function GameSpace(config){
    config.fill = 'black';
    this.x = config.x;
    this.y = config.y;
    this.circle =  new Kinetic.Circle(config);
    this.occupied = false;
    this.spaceNumber = config.spaceNumber;
    config.gameBoard.add(this.circle);
}
