
function Decremantar(){
	var white = 9;
	var red = 9;
	Decremantar.prototype.decrement = function(String){
		if(String == "white"){
			white --;
		}
		else if(String == "red"){
			red --;
		}
		if(red == 0){
			alert("white wins!")
		}
		else if(white == 0){
			alert("red wins!")
		}
	}
	Decremantar.prototype.hasThreeOrLess = function(String){
		if(white <= 3 || red <= 3){
			return true;
		}
			return false;
	}
}




