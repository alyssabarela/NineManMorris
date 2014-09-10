//example from
//http://evanhahn.com/how-do-i-jasmine/
describe("Hello world", function() {
    it("says hello", function() {
        expect(helloWorld()).toEqual("Hello world!");
    });
});
