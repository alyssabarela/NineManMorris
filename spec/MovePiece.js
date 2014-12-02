describe("GameBoard", function() {
  
    beforeEach(function() {
        game_board = new GameBoard(50, 80,
                                   {biggest_side: 400, middle_side: 270, smallest_side:140});
    });
    
    it("moves a piece", function(){
        color = "white"
        for(i = 0; i < 18; i++) {
            if(i == 1) {
                game_board.place_piece(color, 23);
            } else {
                game_board.place_piece(color, i);
            }
            color = game_board.opposite_color(color);
        }
    });
    
});
