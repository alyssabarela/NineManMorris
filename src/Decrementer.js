function Decrementer() {
    this.white = 9;
    this.red = 9;

    Decrementer.prototype.decrement = function(string) {
        if(string == "white") {
            this.white--;
        } else if(string == "red") {
            this.red--;
        }

        if(this.red < 3) {
            return "white";
        } else if(this.white < 3) {
            return "red";
        } else {
            return false;
        }
    }

    Decrementer.prototype.hasThreeOrLess = function(string) {
        if(string == "white") {
            return this.white <= 3;
        } else if(string == "red") {
            return this.red <= 3;
        } else {
            console.error("Decrementor.hasThreeOrLess, string != \"white\" or \"red\"");
        }
    }
}
