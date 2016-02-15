// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var PuzzlePiece = function(game, x, y, j, i, width, height, square) {
var PuzzlePiece = function(game, x, y, j, i, width, height, square) {

  this.game = game;
  this.initialX = x;
  this.initialY = y;

  // Offset for puzzle sizes
  // // 0 - flat
  // // -1 - valley 
  // // 1 - hill
  // var choice = [-1, 1]; 
  // this.top_side=this.bottom_side=this.left_side=this.right_side = 0;

  // if (i === 0 && j === 0) {
  //   this.right_side = choice[rand(0,1)];
  //   this.left_side = choice[rand(0,1)];
  //   console.log(this.left_side, this.right_side);
  // }
  //
  // var height_offset = Math.floor(height*0.1);
  // var width_offset = Math.floor(width*0.1);
  //
  // height += this.top_side*height_offset;
  // height += this.bottom_side*height_offset;
  // width += this.left_side*width_offset;
  // width += this.right_side*width_offset;
  // this.i = i; //i height position
  // this.j = j; //j width position

  // this.arrowbmd = this.game.add.bitmapData(width,height);
  // this.arrowbmd.ctx.clearRect(0,0,width,height);
  // this.arrowbmd.ctx.strokeStyle = '#FFF';
  // this.arrowbmd.ctx.fillStyle = '#000';
  // this.arrowbmd.ctx.lineWidth = 2;
  // this.arrowbmd.ctx.fill();
  // this.arrowbmd.ctx.beginPath();
  // this.arrowbmd.ctx.moveTo(width*1/2,0);
  // this.arrowbmd.ctx.lineTo(0,height*1/2);
  // this.arrowbmd.ctx.lineTo(width*1/4,height*1/2);
  // this.arrowbmd.ctx.lineTo(width*1/4,height);
  // this.arrowbmd.ctx.lineTo(width*3/4,height);
  // this.arrowbmd.ctx.lineTo(width*3/4,height*1/2);
  // this.arrowbmd.ctx.lineTo(width,height*1/2);
  // this.arrowbmd.ctx.fill();

  var img = this.game.make.bitmapData(width, height);
  area = new Phaser.Rectangle(j*width, i*height, width, height);
  img.copyRect('bg1', area, 0, 0);
  img.update();
  
  // var mask = this.game.make.bitmapData(width, height);
  // mask.copyRect(this.arrowbmd, area, width, height);
  //
  // var bmd = this.game.make.bitmapData(width, height);
  // bmd.alphaMask(img, this.arrowbmd);
  // var b = game.add.sprite(x, y, bmd);
  
  var b = game.add.sprite(x, y, img);
  b.inputEnabled = true;
  b.input.enableDrag(true);

  return b;

};

PuzzlePiece.prototype = Object.create(Phaser.Sprite.prototype); 
PuzzlePiece.prototype.constructor = PuzzlePiece;

