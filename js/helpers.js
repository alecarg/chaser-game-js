helpers.getPlayerByCoords = function(x, y){
  return _.find(players, function(p) { return (p.pos.x === x && p.pos.y === y) });
}

helpers.getPlayerByPlayerUid = function(playerUid){
  return _.find(players, function(p) { return (p.uid === playerUid) });
}

helpers.getPlayerBoardTile = function(player){
  return board.getTile(player.pos.x, player.pos.y);
}

helpers.getPlayerIndexInPlayersArr = function(player){
  return _.findIndex(players, function(p) { return (p.uid === player.uid) });
}

helpers.forAllPlayers = function(callback){
  for (var i = 0; i < players.length; i++) {
      callback(i, players[i]);
    }
}