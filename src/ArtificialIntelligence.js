function ArtificialIntelligence(gameBoard) {
    this.gameBoard = gameBoard;
    this.active = false;
}
    ArtificialIntelligence.prototype.your_turn = function() {
        //if in phase 1, place piece randomly
        //if in phase 2, move piece randomly
        //if in phase 3, move piece anywhere randomly
    }
    ArtificialIntelligence.prototype.is_active = function() {
        return this.active;
    }
    ArtificialIntelligence.prototype.toggle_active = function() {
        var active = this.active;
        if(active === true)
            this.active = false;
        else if(active === false)
            this.active = true;
        console.log("toggling ArtificialIntelligence to be " + this.active);
    }
    ArtificialIntelligence.prototype.remove_opponents_piece = function() {
        //ai is always red
        var removeable_pieces = this.gameBoard.get_removeable_pieces("white");
        var index_to_remove = this.choose_random_index(removeable_pieces);
        console.log("attempting to remove piece with index " + index_to_remove);
    }
    ArtificialIntelligence.prototype.choose_random_index = function(index_array) {
        var length = index_array.length;
        var random = Math.floor(Math.random() * length);
        return random
    }

