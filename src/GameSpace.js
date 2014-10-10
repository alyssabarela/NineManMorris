function GameSpace(config){
    config.fill = 'black';
    this.circle =  new Kinetic.Circle(config);
    config.gameBoard.add(this.circle);
}
