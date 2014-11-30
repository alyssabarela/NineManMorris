function ArtificialIntelligence(gameBoard) {
    this.gameBoard = gameBoard;
    this.active = false;
}
    ArtificialIntelligence.prototype.your_turn = function(game_piece) {
        var in_phase_1 = gameBoard.in_phase_1();
        var in_phase_2 = gameBoard.in_phase_2();
        var in_phase_3 = gameBoard.in_phase_3();
        //if in phase 1, place piece randomly
        if(in_phase_1){
           var available_spaces = gameBoard.get_available_spaces();
           var chosen_space = this.choose_random_index(available_spaces);
           gameBoard.move_AI_on_space(game_piece, chosen_space);
        }
        else if(in_phase_2){
            //choose random piece
            var available_pieces = gameBoard.get_available_ai_pieces();
            var chosen_piece = this.choose_random_index(available_pieces);
            var available_spaces = gameBoard.get_available_spaces();
            var chosen_pieces_space_number = gameBoard.gamePieceArray[chosen_piece].space;
            var chosen_pieces_neighbors = gameBoard.space_neighbors[chosen_pieces_space_number]
            //get available spaces to move 
            chosen_pieces_neighbors.forEach(function(neighbor){
                if(neighbor.occupied === false){
                    move_AI_on_space(chosen_piece, neighbor)
                    returnVal = true
                }
                else{
                    returnVal = false
                }
            });
            return returnVal
            //probably a better way to do this, but need to check if all neighbors are taken!! if so we need to move to another piece and try again

        }
        else if(in_phase_3){
            var available_spaces = gameBoard.get_available_spaces();
            var chosen_space = this.choose_random_index(available_spaces);
            gameBoard.move_AI_on_space(game_piece, chosen_space);
        }
        else{
            gameBoard.update_status("something went wrong...")
        }
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
        if(!index_array)
            return
        var length = index_array.length;
        var random = Math.floor(Math.random() * length);
        return index_array[random];
    }

