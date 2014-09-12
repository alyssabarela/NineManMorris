//as of right now, i have to keep copying the js file into src file here rather than referencing it from our actual source files, need to remedy this
describe("Game is created", function() {
    it("creates a stage", function() {
       var ExpectedStage = new Kinetic.Stage({
        container: 'container',
        width: 500,
        height: 600
    });
        var ActualStage = instantiateGame();
        expect(ActualStage.attrs).toEqual(ExpectedStage.attrs);
    });


    it("creates a game board", function() {
        var Expected_game_board = new Kinetic.Group({
            x: 50,
            y: 80
        });
        var Actual_game_board = createGameboard();
        //Kinetic objects are a bit complex, if you just grab attrs, it contains the attributes we actually set, such as x and y here
        expect(Actual_game_board.attrs).toEqual(Expected_game_board.attrs);
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