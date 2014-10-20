
function Decremantar(){
	var white = 9;
	var red = 9;
	Decremantar.prototype.decrement = function(string){
		if(string == "white"){
			white --;
		}
		else if(string == "red"){
			red --;
		}
		if(red == 0){
			alert("white wins!")
		}
		else if(white == 0){
			alert("red wins!")
		}
	}
	Decremantar.prototype.hasThreeOrLess = function(string){
        if(string == "white") {
            return white <= 3;
        } else if(string == "red") {
            return red <= 3;
        } else {
            console.error("Decremantar.hasThreeOrLess, string != \"white\" or \"red\"");
        }
	}
}




