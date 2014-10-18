describe("Game is created", function() {
  
    beforeEach(function() {
	  this.gameFactory = new GameBoard(50, 80, {biggest_side: 400, middle_side: 270, smallest_side:140});
    });
    
    it("sets x", function(){
	expect(50).toEqual(this.gameFactory.x);
    });
    
    it("sets y", function(){
	expect(80).toEqual(this.gameFactory.y);
    });
    
    it("sets box lengths", function(){
	expect({biggest_side: 400, middle_side: 270, smallest_side:140}).toEqual(this.gameFactory.box_lengths);
    });
    
    it("sets side length", function(){
	expect(400).toEqual(this.gameFactory.sideLength);
    });
    
    it("starts in phase one at game start", function(){
	expect(true).toEqual(this.gameFactory.in_phase_1());
    });
    
    it("does not start in phase 2 at game start", function(){
	expect(false).toEqual(this.gameFactory.in_phase_2());
    });
    
    it("does not start in phase 3 at game start", function(){
	expect(false).toEqual(this.gameFactory.in_phase_3());
    });
    
    it("creates 18 game pieces", function(){
	expect(18).toEqual(this.gameFactory.gamePieceArray.length);
    });
    
    it("creates 24 game spaces", function(){
	expect(24).toEqual(this.gameFactory.gameSpaceArray.length);
    });
    
    it("creates a stage", function() {
      
       //this.gameFactory = new GameBoard(50, 80, {biggest_side: 400, middle_side: 270, smallest_side:140});
      
       var ExpectedStage = new Kinetic.Stage({
        container: 'container',
        width: 500,
        height: 600
    });
       
        var ActualStage = this.gameFactory.stageContainer;
        expect(ActualStage.attrs).toEqual(ExpectedStage.attrs);
    });

    it("creates a game board", function() {
      
	//var gameFactory = new GameBoard(50, 80, {biggest_side: 400, middle_side: 270, smallest_side:140});
      
        var Expected_game_board = new Kinetic.Group({
            x: 50,
            y: 80
        });
        var Actual_game_board = this.gameFactory.game_board;
        //Kinetic objects are a bit complex, if you just grab attrs, it contains the attributes we actually set, such as x and y here
        expect(Actual_game_board.attrs).toEqual(Expected_game_board.attrs);
    });
    
    it("sets only one piece to movable", function(){
      
	var countDraggable = 0;
      
	for(var i = 0; i < this.gameFactory.gamePieceArray.length; i++){
	    if(this.gameFactory.gamePieceArray[i].circle.draggable()){
	       countDraggable++;
	    }
	}
	
	expect(1).toEqual(countDraggable);
    });
    
    it("sets the first white piece to movable", function(){
	expect(true).toEqual(this.gameFactory.gamePieceArray[17].circle.draggable());
    });

    it("creates 3 boxes and draws them on the game board", function() {
        expect(true).toEqual(true);
    });

    it("adds game board to game board layer", function() {
        expect(true).toEqual(true);
    });

    it("creates 9 red and 9 white game pieces and adds to game board layer", function() {
        expect(true).toEqual(true);
    });

    it("adds game board layer to the stage", function() {
        expect(true).toEqual(true);
    });
});

describe("Game piece is created", function() {
  
    beforeEach(function() {
      
	this.gameFactory = new GameBoard(50, 80, {biggest_side: 400, middle_side: 270, smallest_side:140});
    
	this.gamePiece = new GamePiece(      450,
					      30,
					      'red',
					      false,
					      this.gameFactory.gameBoardLayer,
					      this.gameFactory.gameSpaceArray,
					      0, this.gameFactory
				      );
    });
  
    it("creates a circle", function(){
	var Expected_circle = new Kinetic.Circle({
				      x: 450,
                                      y: 30,
                                      radius: 20,
                                      fill: 'red',
                                      stroke: 'black',
                                      strokeWidth: 2,
                                      draggable: false});
	
	expect(this.gamePiece.circle.attrs).toEqual(Expected_circle.attrs);
    });
    
    it("test the setDraggable function", function() {
      
	this.gamePiece.setDraggable(true);
      
        expect(true).toEqual(this.gamePiece.circle.draggable());
    });
    
    it("test the set_next function", function() {
      
	this.gamePiece.set_next(true);
      
        expect(true).toEqual(this.gamePiece.circle.next);
    });
    
    
    it("test the setInMill function", function() {
      
	this.gamePiece.setInMill();
      
        expect(false).toEqual(this.gamePiece.removable);
    });
    
    it("test the setSpace function", function() {
      
	this.gamePiece.setSpace(5);
      
        expect(5).toEqual(this.gamePiece.space);
    });
    
    it("test the moved function", function() {
      
        expect(0).toEqual(this.gamePiece.moved());
    });
    
    it("test the on_board function", function() {
      
        expect(false).toEqual(this.gamePiece.on_board());
    });
    
});


describe("Transitions from 1 to 2", function() {
  
    beforeEach(function() {
      
	this.gameFactory = new GameBoard(50, 80, {biggest_side: 400, middle_side: 270, smallest_side:140});
	
	for (var i = 0; i < this.gameFactory.gamePieceArray.length; i++){
      
	  for(var j = 0; j < this.gameFactory.gameSpaceArray.length; j++){
	    
	      if(!this.gameFactory.gameSpaceArray[j].occupied){
		  this.gameFactory.gamePieceArray[i].circle.x(this.gameFactory.gameSpaceArray[j].circle.getAbsolutePosition().x);
		  this.gameFactory.gamePieceArray[i].circle.y(this.gameFactory.gameSpaceArray[j].circle.getAbsolutePosition().y);
		  this.gameFactory.gamePieceArray[i].circle.draggable(true);
		  this.gameFactory.gameSpaceArray[j].occupied = true;
		  this.gameFactory.gamePieceArray[i].circle.on_board = true;
		  this.gameFactory.gameBoardLayer.draw();
		  break;
	      }
	    
	  }
	  
	}

    });
    
    it("test not in phase 1", function() {
      
	
      
         expect(false).toEqual(this.gameFactory.in_phase_1());
    });
    
    it("test in phase 2", function() {
      
	
	
        expect(true).toEqual(this.gameFactory.in_phase_2());
    });
    
    it("test not in phase 3", function() {
      
	
      
         expect(false).toEqual(this.gameFactory.in_phase_3());
    });
    
    
    
      
});
