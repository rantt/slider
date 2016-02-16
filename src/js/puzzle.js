function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Puzzle = function(game, pic, square) {
    this.game = game;
    this.pic = pic;
    this.square = square;

    this.solved = false;
    this.scrambled = false;
    this.scrambling = false;
    this.tileSpeed = 500;
    this.scrambleSpeed = 5;

    //load source image to get image height/width properties
    var src_image = this.game.add.image(0, 0, pic);
    src_image.visible = false;

    var w = src_image.width;
    var h = src_image.height;

    this.offsetX = (Game.w - w)/2; 
    this.offsetY = (Game.h - h)/2; 

    this.tile_width = Math.floor(w/this.square);
    this.tile_height = Math.floor(h/this.square);

    this.pieces = [];
    this.background = [];
		this.piece_list = {};

    //Setup Background Game Board
    for (var i = 0; i < this.square;i++) {
      for (var j = 0; j < this.square;j++) {
        this.background.push(this.makeBox(this.offsetX+j*this.tile_width, this.offsetY+i*this.tile_height,this.tile_width, this.tile_height));
			}
		}

    //Draw Pieces except the top-left corner
    for (var i = 0; i < this.square;i++) {
      for (var j = 0; j < this.square;j++) {
				if ((i !== 0) || (j !== 0)) {
					var piece = new PuzzlePiece(this.game, this.offsetX+j*this.tile_width, this.offsetY+i*this.tile_height, j, i, this.tile_width, this.tile_height,pic);
					piece.events.onInputUp.add(this.movePiece, this);
					this.piece_list[j+'_'+i] = piece;
          this.pieces.push(piece);
				}

      }
    }

};

Puzzle.prototype = Puzzle.prototype.constructor = Puzzle;
Puzzle.prototype = {
  destroy: function() {
    this.pieces.forEach(function(piece) {
      if (piece != undefined) {
        piece.destroy();
      }
    }, this);
   this.background.forEach(function(piece) {
        piece.destroy();
    }, this);
   
  },
  makeBox: function(x,y,width, height) {
		var box = this.game.add.graphics(width, height);
		//fill and linestyle
		box.beginFill(0xFFFFFF);
		box.lineStyle(2, 0xFF00FF, 1);
		box.drawRect(x-(width), y-(height), width, height);

		return box;
  },
  scramble: function(moves, gap, lastaction) {
    if (moves == 0) {
      this.speed = this.tileSpeed;
      this.tweening = false;
      this.scrambled = true;
      return;
    }

    this.scrambling = true;
    this.speed = this.scrambleSpeed;
    var gap = gap || {'i':0, 'j': 0};
    var directions = ['up', 'down', 'left', 'right']; 
    var piece;

    if (lastaction !== undefined) {
      if(lastaction === 'up'){directions.indexOf('down');}
      if(lastaction === 'down'){directions.indexOf('up');}
      if(lastaction === 'right'){directions.indexOf('left');}
      if(lastaction === 'left'){directions.indexOf('right');}
    }
    
    var rd = Math.floor(Math.random() * directions.length);
    var rs =  directions[rd];

    if(rs == 'up') {
      piece = this.piece_list[gap.j+'_'+(gap.i-1)];
    }else if(rs == 'down') {
      piece = this.piece_list[gap.j+'_'+(gap.i+1)];
    }else if(rs == 'left') {
      piece = this.piece_list[(gap.j-1)+'_'+gap.i];
    }else if(rs == 'right') {
      piece = this.piece_list[(gap.j+1)+'_'+gap.i];
    }

    if (piece !== undefined) {
      gap.i = piece.i;
      gap.j = piece.j;

      this.game.time.events.add(Phaser.Timer.SECOND * (this.scrambleSpeed)/100, function() { 
        this.movePiece(piece);
        moves--;
        this.scramble(moves, gap, rs);
      }, this);
    }else {
      this.scramble(moves, gap, rs);
    } 
  },
	movePiece: function(piece) {
    if (this.solved) {return;}

		if (this.piece_list[(piece.j-1)+'_'+piece.i] === undefined && (piece.j-1) >= 0) {
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.j -= 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = this.offsetX+piece.j*piece.width; 
			this.game.add.tween(piece).to({x: pos},this.speed).start();
		}else if(this.piece_list[(piece.j+1)+'_'+piece.i] === undefined && (piece.j+1) < this.square) {
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.j += 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = this.offsetX+piece.j*piece.width; 
			this.game.add.tween(piece).to({x: pos},this.speed).start();
		}else if(this.piece_list[piece.j+'_'+(piece.i-1)] === undefined && (piece.i-1) >=0) {
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.i -= 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = this.offsetY+piece.i*piece.height; 
			this.game.add.tween(piece).to({y: pos},this.speed).start();
		}else if(this.piece_list[piece.j+'_'+(piece.i+1)] === undefined && (piece.i+1) < this.square) {
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.i += 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = this.offsetY+piece.i*piece.height; 
			this.game.add.tween(piece).to({y: pos},this.speed).start();
		}

    if (this.checkWin() && this.scrambled) {
      // Wait for piece to finish moving then Add the missing piece if puzzle is solved
      this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() { 
        var piece = new PuzzlePiece(this.game, this.offsetX, this.offsetY, 0, 0, this.tile_width, this.tile_height,this.pic);
        this.pieces.push(piece);
      }, this);

      this.solved = true;
    }

	},
  checkWin: function() {
    for(var x=0; x < this.pieces.length;x++) {
      if (this.pieces[x].i !== this.pieces[x].initialI || this.pieces[x].j !== this.pieces[x].initialJ) {
        return false;
      }
    }
    return true;
  },
};

