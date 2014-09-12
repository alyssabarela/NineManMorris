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

            var stage = new Kinetic.Stage({
                container: 'container',
                width: 500,
                height: 600
            });

            var layer = new Kinetic.Layer();

            var game_board = new Kinetic.Group({
                x: 50,
                y: 80
            });

            for(var i = 0; i < 3; i++) {
                var box_xy_offset = i * 50;
                var box_side_length = 400 - (i * 100);
                var box = new Kinetic.Rect({
                    x: box_xy_offset,
                    y: box_xy_offset,
                    width: box_side_length,
                    height: box_side_length,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 4
                });

                if(i == 2) {
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
                game_board.add(box);

                var get_coordinate = function(index) {
                    return box_xy_offset + index * .5 * box_side_length;
                }
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
            layer.add(game_board);

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

                layer.add(white_game_piece);
                layer.add(red_game_piece);
            }

            stage.add(layer);