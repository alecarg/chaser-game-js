helpers.getPlayerByCoords = function(x, y){
  return _.find(players, function(p) { return (p.pos.x === x && p.pos.y === y) });
}

helpers.getPlayerByPlayerUid = function(playerUid){
  return _.find(players, function(p) { return (p.uid === playerUid) });
}

helpers.getBoardTileTypeByPlayer = function(player){
  return board.getTile(player.pos.x, player.pos.y);
}

helpers.getPlayerIndexInPlayersArr = function(player){
  var index = _.findIndex(players, function(p) { return (p.uid === player.uid) });
  if (index == -1){ // the only time the index can't be found is if the turnOwner just died; we keep a copy of its index for this case; TODO
  	index = game.turnOwner.index;
  }
  return index;
}

helpers.forAllPlayers = function(callback){
  for (var i = 0; i < players.length; i++) {
      callback(i, players[i]);
    }
}