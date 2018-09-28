class Player {
  constructor(posx, posy, uid){
    this.uid = uid;
    this.number = uid + 1;

    this.pos = {};
    this.pos.x = posx;
    this.pos.y = posy;

    this.distanceToChaser = {};

    this.direction = null;
  }

  setCurrDistanceToChaser(){
    this.distanceToChaser.x = Math.abs(chaser.pos.x - this.pos.x);
    this.distanceToChaser.y = Math.abs(chaser.pos.y - this.pos.y);
    this.distanceToChaser.total = this.distanceToChaser.x + this.distanceToChaser.y;
  }

  move(direction){
    if (direction == 'left'){
      if (board.isEmptyTile(this.pos.x - 1, this.pos.y)){
      	return this.pos.x--;
      }
    } else
    if (direction == 'right'){
      if (board.isEmptyTile(this.pos.x + 1, this.pos.y)){
        return this.pos.x++;
      }
    } else
    if (direction == 'up'){
      if (board.isEmptyTile(this.pos.x, this.pos.y - 1)){
        return this.pos.y--;
      }
    } else
    if (direction == 'down'){
      if (board.isEmptyTile(this.pos.x, this.pos.y + 1)){
        return this.pos.y++;
      }
    }

    logger.log('Player ' + this.number + ' has not moved this turn as the target tile was occupied.');
  }

  onNewTurn(){
    this.onNewTurnFromLiveCode();
  }

  onNewTurnFromLiveCode(){
    eval(codeMirror.getValue());
  }
}