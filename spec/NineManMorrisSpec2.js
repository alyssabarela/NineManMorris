describe("Decremantar", function() {
    it("Keeps track of how many pieces are on the board", function() {
        decremantar = new Decremantar();
        decremantar.decrement("white");
        decremantar.decrement("red");
        decremantar.decrement("white");
        decremantar.decrement("red");
        expect(decremantar.red).toEqual(7);
        expect(decremantar.white).toEqual(7);
    });

    it("returns true if the number of pieces for a player is less than three.", function() {
        decremantar = new Decremantar();
        for(i = 0; i < 6; i++) {
            decremantar.decrement("white");
            decremantar.decrement("red");
        }
        expect(decremantar.hasThreeOrLess("red")).toEqual(true);
        expect(decremantar.hasThreeOrLess("white")).toEqual(true);
    });
});
