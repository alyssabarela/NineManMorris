describe("GameBoard", function() {
  
    beforeEach(function() {
        game_board = new GameBoard(50, 80,
                                   {biggest_side: 400, middle_side: 270, smallest_side:140});
    });
    
    it("Places a piece", function(){
        expect(game_board.place_piece("white", 0)).toEqual(true);
        expect(game_board.get_piece_on(0).get_color()).toEqual("white");
    });
    
});
