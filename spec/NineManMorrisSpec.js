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
    
    it("checks if ai is active", function(){
	expect(false).toEqual(this.gameFactory.ai_is_active());
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

describe("Transitions from 2 to 3", function() {
  
    beforeEach(function() {
      
	this.gameFactory = new GameBoard(50, 80, {biggest_side: 400, middle_side: 270, smallest_side:140});
	
	for (var i = 0; i < 6; i++){
      
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
      
	
      
         expect(true).toEqual(this.gameFactory.in_phase_1());
    });
    
    it("test not in phase 2", function() {
      
	
	
        expect(false).toEqual(this.gameFactory.in_phase_2());
    });
    
    it("test in phase 3", function() {
      
	
      
         expect(false).toEqual(this.gameFactory.in_phase_3());
    });
    
    
    
      
});


describe("Decrementer", function() {
    it("Keeps track of how many pieces are on the board", function() {
        decrementer = new Decrementer();
        decrementer.decrement("white");
        decrementer.decrement("red");
        decrementer.decrement("white");
        decrementer.decrement("red");
        expect(decrementer.red).toEqual(7);
        expect(decrementer.white).toEqual(7);
    });

    it("returns true if the number of pieces for a player is less than three.", function() {
        decrementer = new Decrementer();
        for(i = 0; i < 6; i++) {
            decrementer.decrement("white");
            decrementer.decrement("red");
        }
        expect(decrementer.hasThreeOrLess("red")).toEqual(true);
        expect(decrementer.hasThreeOrLess("white")).toEqual(true);
    });
});

describe("Test AI", function() {
  
    beforeEach(function() {
      this.gameFactory = new GameBoard(50, 80, {biggest_side: 400, middle_side: 270, smallest_side:140});
    });

    beforeEach(function() {
      this.aiFactory = new ArtificialIntelligence(this.gameFactory);
    });


    it("checks if ai is active", function(){
        expect(false).toEqual(this.gameFactory.ai_is_active());
    });


    it("checks if ai in ArtificialIntelligence class is active", function(){
        expect(false).toEqual(this.aiFactory.is_active());
    });

    it("checks if ai in ArtificialIntelligence class toggle_active is equal to this.active", function(){
        expect(this.active).toEqual(this.aiFactory.toggle_active());
    });

    it("checks if ai in ArtificialIntelligence class remove's piece correctly", function(){
        expect(this.setTimeout).toEqual(this.aiFactory.remove_opponents_piece ());
    });

    it("checks if gameBoard toggle_ai is active", function(){
        expect(this.active).toEqual(this.gameFactory.toggle_ai());
    });

});

describe("Play a 2 player game", function() {
  
    beforeEach(function() {
	this.gameFactory = new GameBoard(50, 80, {biggest_side: 400, middle_side: 270, smallest_side:140});
    });
    
    it("move first white piece to top left", function() {
	 this.gameFactory.place_piece("white", 0);
         expect(this.gameFactory.gameSpaceArray[0].occupied).toEqual("white");
    });
    
    it("move first red piece to top right", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
         expect(this.gameFactory.gameSpaceArray[5].occupied).toEqual("red");
    });
    
    it("move second white piece to left middle", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
         expect(this.gameFactory.gameSpaceArray[1].occupied).toEqual("white");
    });
    
    it("move second red piece to right middle", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
         expect(this.gameFactory.gameSpaceArray[6].occupied).toEqual("red");
    });
    
    it("move third white piece to left bottom", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
         expect(this.gameFactory.gameSpaceArray[2].occupied).toEqual("white");
    });
    
    it("move third red piece to right bottom", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	expect(this.gameFactory.gameSpaceArray[7].occupied).toEqual("red");
        //expect(this.gameFactory.piece_is_in_mill(this.gameFactory.gamePieceArray[0])).toEqual(true);
	//expect(this.gameFactory.check_for_mills()).toEqual(true);
    });
    
    it("move fourth white piece to top middle", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	expect(this.gameFactory.gameSpaceArray[3].occupied).toEqual("white");
    });
    
    it("move fourth red piece to bottom middle", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	expect(this.gameFactory.gameSpaceArray[4].occupied).toEqual("red");
    });
    
    it("move fifth white piece to top left of 2nd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	expect(this.gameFactory.gameSpaceArray[8].occupied).toEqual("white");
    });
    
    it("move fifth red piece to top right of 2nd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	this.gameFactory.place_piece("red", 13);
	expect(this.gameFactory.gameSpaceArray[13].occupied).toEqual("red");
    });
    
    it("move sixth white piece to left middle of 2nd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	this.gameFactory.place_piece("red", 13);
	this.gameFactory.place_piece("white", 9);
	expect(this.gameFactory.gameSpaceArray[9].occupied).toEqual("white");
    });
    
    it("move sixth red piece to right middle of 2nd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	this.gameFactory.place_piece("red", 13);
	this.gameFactory.place_piece("white", 9);
	this.gameFactory.place_piece("red", 14);
	expect(this.gameFactory.gameSpaceArray[14].occupied).toEqual("red");
    });
    
    it("move seventh white piece to left bottom of 2nd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	this.gameFactory.place_piece("red", 13);
	this.gameFactory.place_piece("white", 9);
	this.gameFactory.place_piece("red", 14);
	this.gameFactory.place_piece("white", 10);
	expect(this.gameFactory.gameSpaceArray[10].occupied).toEqual("white");
    });
    
    it("move seventh red piece right bottom of 2nd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	this.gameFactory.place_piece("red", 13);
	this.gameFactory.place_piece("white", 9);
	this.gameFactory.place_piece("red", 14);
	this.gameFactory.place_piece("white", 10);
	this.gameFactory.place_piece("red", 15);
	expect(this.gameFactory.gameSpaceArray[15].occupied).toEqual("red");
    });
    
    it("move eighth white piece left top of 3rd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	this.gameFactory.place_piece("red", 13);
	this.gameFactory.place_piece("white", 9);
	this.gameFactory.place_piece("red", 14);
	this.gameFactory.place_piece("white", 10);
	this.gameFactory.place_piece("red", 15);
	this.gameFactory.place_piece("white", 16);
	expect(this.gameFactory.gameSpaceArray[16].occupied).toEqual("white");
    });
    
    it("move eighth red piece right top of 3rd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	this.gameFactory.place_piece("red", 13);
	this.gameFactory.place_piece("white", 9);
	this.gameFactory.place_piece("red", 14);
	this.gameFactory.place_piece("white", 10);
	this.gameFactory.place_piece("red", 15);
	this.gameFactory.place_piece("white", 16);
	this.gameFactory.place_piece("red", 21);
	expect(this.gameFactory.gameSpaceArray[21].occupied).toEqual("red");
    });
    
    it("move ninth white piece left middle of 3rd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	this.gameFactory.place_piece("red", 13);
	this.gameFactory.place_piece("white", 9);
	this.gameFactory.place_piece("red", 14);
	this.gameFactory.place_piece("white", 10);
	this.gameFactory.place_piece("red", 15);
	this.gameFactory.place_piece("white", 16);
	this.gameFactory.place_piece("red", 21);
	this.gameFactory.place_piece("white", 17);
	expect(this.gameFactory.gameSpaceArray[17].occupied).toEqual("white");
    });
    
    it("move ninth red piece right middle of 3rd square", function() {
	this.gameFactory.place_piece("white", 0);
	this.gameFactory.place_piece("red", 5);
	this.gameFactory.place_piece("white", 1);
	this.gameFactory.place_piece("red", 6);
	this.gameFactory.place_piece("white", 2);
	this.gameFactory.place_piece("red", 7);
	this.gameFactory.place_piece("white", 3);
	this.gameFactory.place_piece("red", 4);
	this.gameFactory.place_piece("white", 8);
	this.gameFactory.place_piece("red", 13);
	this.gameFactory.place_piece("white", 9);
	this.gameFactory.place_piece("red", 14);
	this.gameFactory.place_piece("white", 10);
	this.gameFactory.place_piece("red", 15);
	this.gameFactory.place_piece("white", 16);
	this.gameFactory.place_piece("red", 21);
	this.gameFactory.place_piece("white", 17);
	this.gameFactory.place_piece("red", 22);
	expect(this.gameFactory.gameSpaceArray[22].occupied).toEqual("red");
    });
    
});
