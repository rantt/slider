var PuzzlePiece = function(game, x, y, j, i, width, height, pic) {

  this.game = game;

  var img = this.game.make.bitmapData(width, height);
  area = new Phaser.Rectangle(j*width, i*height, width, height);
  img.copyRect(pic, area, 0, 0);
  img.update();
  
  var tile_sprite = game.add.sprite(x, y, img);
  tile_sprite.inputEnabled = true;
	tile_sprite.i = i;
	tile_sprite.j = j;
  tile_sprite.initialJ = j;
  tile_sprite.initialI = i;

  return tile_sprite;

};

PuzzlePiece.prototype.constructor = PuzzlePiece;

