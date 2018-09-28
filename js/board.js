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

    // create the canvas context
    var ctx = document.getElementById('main').getContext('2d');

    // clear the canvas
    ctx.clearRect(0, 0, 2500, 2500);

    // loop through our map and draw out the image represented by the number.
    for (var i = 0; i < board.tiles.length; i++) {
      for (var j = 0; j < board.tiles[i].length; j++) {
        board.drawTerrain(ctx, i, j);
        board.drawCharacters(ctx, i, j);
      }
    }
}

board.drawTerrain = function(ctx, i, j) {

  var drawX = (i - j) * board.tileH + board.mapX;
  var drawY = (i + j) * board.tileH / 2 + board.mapY;

  tileToDraw = board.getTile(i, j); // 0 or 1 = map
  ctx.drawImage(board.tileGraphics[tileToDraw], drawX, drawY);
}

board.drawCharacters = function(ctx, i, j) {

  var drawX = (i - j) * board.tileH + board.mapX;
  var drawY = (i + j) * board.tileH / 2 + board.mapY;
  
  var characterElevation = 52; // things "on" the board are offsetedY to look on top
  var isChaserInCurrTile = (chaser.pos.x === i && chaser.pos.y === j);
  var playerInCurrTile = helpers.getPlayerByCoords(i, j);

  if (isChaserInCurrTile) {

    ctx.drawImage(board.tileGraphics[2], drawX, drawY - characterElevation);

  } else if (playerInCurrTile) {

    ctx.drawImage(board.tileGraphics[3], drawX, drawY - characterElevation);

    // Draw player's number
    var playerUid = playerInCurrTile.number.toString();
    ctx.font = '18px Verdana';
    ctx.fillText(playerUid, drawX, drawY);
  }
}

board.getTile = function(x, y){
  try {
    var tile = board.tiles[x][y];
  } catch(e){
    console.log('Tried to get tile outside of map.');
    game.restart();
  }
  return tile;
}