function ArtificialIntelligence(gameBoard) {
    this.gameBoard = gameBoard;
    this.active = false;
}
    ArtificialIntelligence.prototype.your_turn = function(game_piece) {
        var returnVal = false;
        var in_phase_1 = gameBoard.in_phase_1();
        var in_phase_2 = gameBoard.in_phase_2();
        var in_phase_3 = gameBoard.in_phase_3();
        //if in phase 1, place piece randomly
        if(in_phase_1){
           var available_spaces = gameBoard.get_available_spaces();
           var chosen_space = this.choose_random_array_element(available_spaces);
           gameBoard.place_piece("red", chosen_space);
           returnVal = true;
           return returnVal;
        }
        else if(in_phase_2) {
            possible_moves = new Array();
            gameBoard.get_available_ai_pieces().forEach(function(piece) {
                neighbors = gameBoard.space_neighbors[piece.get_space().spaceNumber];

                for(var n = 0; n < neighbors.length; n++) {
                    something = neighbors[n];
                    if(something && something.spaceNumber) {
                        break;
                    } else {
                        neighbor = gameBoard.gameSpaceArray[something];
                        neighbors[n] = neighbor;
                    }
                }
                neighbors.forEach(function(neighbor) {
                    if(neighbor && !(neighbor.occupied)) {
                        old = piece.get_space().spaceNumber;
                        new_index = neighbor.spaceNumber;
                        possible_moves.push({old_space_index: old,
                                             new_space_index: new_index});
                    }
                });
            });

            there_are = function(array) { return array.length > 0; }
            if(there_are(possible_moves)) {
                chosen_move = this.choose_random_array_element(possible_moves);
                gameBoard.move_piece(chosen_move.old_space_index, chosen_move.new_space_index);
                returnVal = true;
                return returnVal;
            } else {
                console.error("Ai in blocked state but not detected where it ought to be.");
            }
            return returnVal;
        }
        else if(in_phase_3){
            var available_spaces = gameBoard.get_available_spaces();
            var chosen_space = this.choose_random_array_element(available_spaces);
            gameBoard.move_AI_on_space(game_piece, chosen_space);
            returnVal = true;
            return returnVal;
        }
        else{
            gameBoard.update_status("something went wrong...");
            return returnVal;
        }
        //if in phase 2, move piece randomly
        //if in phase 3, move piece anywhere randomly
        return returnVal;
    }
    ArtificialIntelligence.prototype.is_active = function() {
        return this.active;
    }
    ArtificialIntelligence.prototype.toggle_active = function() {
        if(this.is_active()) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    ArtificialIntelligence.prototype.deactivate = function() {
        this.active = false;
    }

    ArtificialIntelligence.prototype.activate = function() {
        this.active = true;
    }

    ArtificialIntelligence.prototype.is_active = function() {
        return this.active;
    }

    ArtificialIntelligence.prototype.remove_opponents_piece = function() {
        //ai is always red
        var removable_pieces = this.gameBoard.get_removable_pieces("white");
        var piece = this.choose_random_array_element(removable_pieces);
        setTimeout(function() {
            this.gameBoard.remove_piece(piece);
            setTimeout(function() {
                this.gameBoard.update_status("white's turn");
            }, 2000);
        }, 2000);
    }

    ArtificialIntelligence.prototype.choose_random_array_element = function(array) {
        if(!array)
            return;
        var length = array.length;
        var random = Math.floor(Math.random() * length);
        return array[random];
    }

