var PuzzlePiece = function(game, x, y, j, i, width, height, pic) {

  this.game = game;
  // this.initialX = x;
  // this.initialY = y;

  var img = this.game.make.bitmapData(width, height);
  area = new Phaser.Rectangle(j*width, i*height, width, height);
  img.copyRect(pic, area, 0, 0);
  img.update();
  
  var b = game.add.sprite(x, y, img);
  b.inputEnabled = true;
	b.i = i;
	b.j = j;
  b.initialJ = j;
  b.initialI = i;

  return b;

};

PuzzlePiece.prototype.constructor = PuzzlePiece;

