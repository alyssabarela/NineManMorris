//POSSIBLE GAME STRUCTURE
//Game object contains pieces containers and board
//it's "main method" looks for a div with the id "container"
//and puts itself in the container
//TODO make game piece container group
//     for each set of game pieces
//     position them correctly
//TODO DRY up existing code
//         create class for lines
//TODO make game_board it's own object
//     game_board.add_to_layer(layer)
//TODO are these good variable names?
//TODO get rid of magic numbers?
//TODO make script a separate file


var stage = instantiateGame()



function instantiateGame(){
    var stageContainer = new Kinetic.Stage({
        container: 'container',
        width: 500,
        height: 600
    });

    var gameBoardLayer = new Kinetic.Layer();
    var game_board = createGameboard();
    drawBoxes(game_board);
    gameBoardLayer.add(game_board);
    drawGamePieces(gameBoardLayer);
    stageContainer.add(gameBoardLayer);
    return stageContainer;
}

function createGameboard(){
    /*
    The game board is built out of KinetcJS primitives, namely:
    3 successively smaller boxes, each on top of the other
    1 horizontal line crossing the middle of the board, covered
    by the smallest box.
    1 vertical line crossing the middle of the board, covered
    by the smallest box.
    24 dots on the corners and midpoints of the sides of each box.

    None of these primitives are draggable
    */
    var game_board = new Kinetic.Group({
        x: 50,
        y: 80
    });
    return game_board;
}

function drawBoxes(game_board){
    //The outer for-loop draws each box and the the vertical and
    //horizontal lines.
    for(var i = 0; i < 3; i++) {
        var box_xy_offset = i * 50;
        var box_side_length = 400 - (i * 100);

    //This object is created in each iteration of the for-loop
    //and is made successively smaller.
    var box = new Kinetic.Rect({
        x: box_xy_offset,
        y: box_xy_offset,
        width: box_side_length,
        height: box_side_length,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 4
    });

    //This if statement checks to see if the second box has
    //been drawn. If it has then the horizontal and vertical
    //lines are drawn.
    if(i == 2) {
        drawLines(game_board);
    }
    game_board.add(box);

    drawSpaces(game_board, box_xy_offset, box_side_length);
    }
}

function drawLines(game_board){
    var  vertical_line = new Kinetic.Line({
        points: [200, 0, 200, 400],
        stroke: 'black',
        strokeWidth: 4
    });

    var  horizontal_line = new Kinetic.Line({
        points: [0, 200, 400, 200],
        stroke: 'black',
        strokeWidth: 4
    });

    game_board.add(horizontal_line);
    game_board.add(vertical_line);
}

function drawSpaces(game_board, box_xy_offset, box_side_length){
    //This function helps the for-loop below determine the
    //x or y position for each of the 24 dots
    var get_coordinate = function(index) {
        return box_xy_offset + index * .5 * box_side_length;
    }
    //This for-loop draws the 24 dots
    //j helps determine the x position of the dot
    //k helps determine the y position of the dot
    for(var j = 0; j < 3; j++) {
        for(var k = 0; k < 3; k++) {
            if(j != 1 || k != 1) {
                var dot = new Kinetic.Circle({
                    x: get_coordinate(j),
                    y: get_coordinate(k),
                    radius: 10,
                    fill: 'black'
                });
                game_board.add(dot);
            }
        }
    }

}

function drawGamePieces(gameBoardLayer){
    //This for-loop creates all game pieces
    for(var t = 0; t < 9; t++) {
        var white_game_piece = new Kinetic.Circle({
            x: 30 + 15 * t,
            y: 30,
            radius: 20,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        });

        var red_game_piece = new Kinetic.Circle({
            x: 390 - 15 * t,
            y: 30,
            radius: 20,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        });

        gameBoardLayer.add(white_game_piece);
        gameBoardLayer.add(red_game_piece);
    }
}