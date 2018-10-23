board.create = function(){
  
  // Set initial board size
  var canvas = document.getElementById('main');
  canvas.width = board.canvasWidth;
  canvas.height = board.canvasHeight;

  board.loadAssets(function(err){
    if (err !== null){
      console.log(err);
    } else {
      board.draw();
    }
  });
}

board.loadAssets = function(callback) {
      
    // Images to be loaded and used.
    // As water is loaded first it will be represented by a 0 on the map and land will be a 1.
    var tileGraphicsToLoad = [
      "assets/water.png", // 0 (water)
      "assets/land.png", // 1 (land)
      "assets/chaser.png", // 2 (chaser)
      "assets/ralph.png" // 3 (player)
    ],
    tileGraphicsLoaded = 0;

    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
      board.tileGraphics[i] = new Image();
      board.tileGraphics[i].src = tileGraphicsToLoad[i];
      board.tileGraphics[i].onload = function() {
        // Check if all images are ready.
        tileGraphicsLoaded++;
        if (tileGraphicsLoaded === tileGraphicsToLoad.length) {
            callback(null, {});
        }
      }
    }
}

board.draw = function() {

    // clear the canvas
    board.ctx.clearRect(0, 0, 2500, 2500);

    // loop through our map and draw out the image represented by the number.
    for (var i = 0; i < board.tiles.length; i++) {
      for (var j = 0; j < board.tiles[i].length; j++) {
        var drawX = (i - j) * board.tileH + board.offsetX;
        var drawY = (i + j) * board.tileH / 2 + board.offsetY;
        board.drawTerrain(i, j, drawX, drawY);
        board.drawCharacters(i, j, drawX, drawY);
      }
    }
}

board.drawTerrain = function(i, j, drawX, drawY) {
  var tileToDraw = board.getTile(i, j); // 0 or 1 = map
  board.ctx.drawImage(board.tileGraphics[tileToDraw], drawX, drawY);
}

board.drawCharacters = function(i, j, drawX, drawY) {
  var characterElevation = (board.tileH - 5); // things "on" the board are offsetedY to look on top
  var isChaserInCurrTile = (chaser.pos.x === i && chaser.pos.y === j);
  var playerInCurrTile = helpers.getPlayerByCoords(i, j);

  if (isChaserInCurrTile) {
    var tileToDraw = 2;
    board.ctx.drawImage(board.tileGraphics[tileToDraw], drawX, drawY - characterElevation);

    // Draw chaser's name
    board.ctx.font = '11px Arial Black';
    board.ctx.fillText('Chaser', drawX + 20 - ('Chaser'.length * 2.5), drawY - 30);
    return;
  }

  if (playerInCurrTile) {
    var tileToDraw = 3;
    board.ctx.drawImage(board.tileGraphics[tileToDraw], drawX, drawY - characterElevation);

    // Draw player's name
    var playerName = playerInCurrTile.name;
    var playerNameLength = playerName.length;
    board.ctx.font = '11px Arial Black';
    board.ctx.fillText(playerName, drawX + 20 - (playerNameLength * 2.5), drawY - 30);
    return;
  }
}

board.getTile = function(x, y){
  var tile = null;
  try {
    tile = board.tiles[x][y];
  } catch(e){
    console.error('Tried to get tile outside of map.');
  }
  return tile;
}

board.isTileSuitableForMovement = function(x, y){
  if (board.isTileInMapBoundaries(x, y) && board.isTileEmptyOfCharacters(x, y)){
    return true;
  } else {
    return false;
  }
}

board.isTileInMapBoundaries = function(x, y){
  return (board.getTile(x, y) != null);
}

board.isTileEmptyOfCharacters = function(x, y){
  var isPlayerInTile = !!helpers.getPlayerByCoords(x, y);
  var isChaserInTile = !!(chaser.pos.x == x && chaser.pos.y == y);
  var isEmptyTile = (!isPlayerInTile && !isChaserInTile);
  return isEmptyTile;
}