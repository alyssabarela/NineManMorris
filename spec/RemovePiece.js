describe("GameBoard", function() {
  
    beforeEach(function() {
        game_board = new GameBoard(50, 80,
                                   {biggest_side: 400, middle_side: 270, smallest_side:140});
    });
    
    it("removes a piece", function(){
        game_board.place_piece("white", 0);
        game_board.place_piece("red", 2);
        game_board.place_piece("white", 3);
        game_board.place_piece("red", 4);
        game_board.place_piece("white", 5);
        expect(game_board.get_piece_on(2).get_color()).toEqual("red");
        setTimeout(function() {
            expect(game_board.remove_piece(2)).toEqual(true);
            expect(game_board.get_piece_on(2)).toEqual(false);
        }, 1000);
    });
    
});
