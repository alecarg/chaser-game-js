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
      this.pos.x--;
    } else
    if (direction == 'right'){
      this.pos.x++;
    } else
    if (direction == 'up'){
      this.pos.y--;
    } else
    if (direction == 'down'){
      this.pos.y++;
    }
  }

  onNewTurn(){
    
  }

  onNewTurnFromLiveCode(){
    eval(codeMirror.getValue());
  }
}