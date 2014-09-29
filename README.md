NineManMorris
=============

Team Dino Riders
-------------

nmmStyles.css
-this file simply holds any CSS styles that we may need

NineManMorris.html
-this file is an html file consisting of an HTML5 canvas and some script tags to pull in the 'meat' of the project

NineManMorris.js
-this file acts as a driver, it will have access to other classes, such as gameboard and game piece.
-

GameBoard.js
-this file contains functionality of the gameboard class the functions available are listed below
-GameBoard(xLoc, yLoc, sideLength) - this creates a gameboard the xLoc,yLoc with each side being sideLength long, it uses other functions within the class to create the entire gamebaord
-GameBoard.prototype.drawBoxes = function(game_board) - creates the 3 boxes that are within the gameboard, takes a gameboard to draw the boxes onto
-GameBoard.prototype.drawLines = function(game_board) - draws the lines that go in the middle of each box, takes a gameboard to draw the lines onto
-GameBoard.prototype.drawSpaces = function(game_board, box_xy_offset, box_side_length) - draws the spaces on which a player can drop their game piece, takes a gameboard to draw the spaces onto, takes the box_xy_offset and box_side_length to know how to align spaces
-GameBoard.prototype.drawGamePieces = function(layer) - draws gamepieces to gameboard, takes a layer of the gameboard to draw them to


GamePiece.js
-this file contains functionality of the game piece class the functions available are listed below
GamePiece(xPos, yPos, radius, fill, stroke, strokeWidth, draggable, layer) - draws a single game piece according to the parameters.  xPos and yPos define where the game piece will sit, radius will define the size, fill, stroke and strokeWidth will determine the color and border, draggable defines wheter or not the piece is able to move, and layer is the layer on which the piece will be drawn.
writeMessage(message) - writes a message to the gameboard on drag start and drag end of a game piece