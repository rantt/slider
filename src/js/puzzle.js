function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Puzzle = function(game, pic, square) {
    this.game = game;
    this.pic = pic;
    this.square = square;

    this.solved = false;
    this.scrambled = false;
    this.tweening = false;
    this.rndAmount = 1;
    this.tileSpeed = 500;
    this.scrambleSpeed = 10;

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

    this.game.time.events.add(Phaser.Timer.SECOND * 1, function() { 
      this.scramble(this.square*2, ['down','right']);
    }, this);


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
  scramble: function(moves, directions, gap, lastmove) {
    if (moves == 0) {
      this.scrambled = true;
      return;
    }
    // if (this.movedPieces() == moves) {
    //   this.speed = this.tileSpeed;
    //   this.scrambled = true;
    //   return;
    // }
    this.speed = this.scrambleSpeed;

    var gap = gap || {'i':0, 'j': 0};
    var piece;

    console.log('directions'+directions);
    console.log(moves);
    console.log(gap);
    if (directions[0] == undefined   || directions == undefined) {
      console.log('here');
      var directions = ['up', 'down', 'left', 'right']; 
    }

    if (lastmove !== undefined) {
      if (lastmove === 'up') {directions.indexOf('down');}
      if (lastmove === 'down') {directions.indexOf('up');}
      if (lastmove === 'right') {directions.indexOf('left');}
      if (lastmove === 'left') {directions.indexOf('right');}
      console.log('lm'+lastmove);
    }
    
    var rd = Math.floor(Math.random() * directions.length);
    var rs = directions.splice(rd,1);
    // var rs =  directions[rd];
    console.log(rs);

    if(rs == 'up') {
      console.log('up');
      piece = this.piece_list[gap.j+'_'+(gap.i-1)];
    }else if(rs == 'down') {
      console.log('down');
      piece = this.piece_list[gap.j+'_'+(gap.i+1)];
    }else if(rs == 'left') {
      console.log('left');
      piece = this.piece_list[(gap.j-1)+'_'+gap.i];
    }else if(rs == 'right') {
      console.log('right');
      piece = this.piece_list[(gap.j+1)+'_'+gap.i];
    }

      if (piece !== undefined) {
        console.log('moving piece');
        gap.i = piece.i;
        gap.j = piece.j;

        this.game.time.events.add(Phaser.Timer.SECOND * this.scrambleSpeed/100, function() { 
          this.movePiece(piece);
          moves--;
          // directions = ['up','down','right','left'];
          this.scramble(moves, directions, gap, rs);
        }, this);
      }else {
        directions.indexOf(rs);
        this.scramble(moves, directions, gap, rs);
      } 
  },
  movedPieces: function() {
    var count = 0;
    this.pieces.forEach(function(piece) {
      if (piece.i !== piece.initialI || piece.j !== piece.initialJ) {
        count++;
      }
    },this);
    return count;
  },
	movePiece: function(piece) {
    if (this.solved || this.tweening) {return;}
    this.tweening = true;

		if (this.piece_list[(piece.j-1)+'_'+piece.i] === undefined && (piece.j-1) >= 0) {
			// console.log('left');
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.j -= 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = this.offsetX+piece.j*piece.width; 
			this.game.add.tween(piece).to({x: pos},this.speed, 'Linear', true).onComplete.add(function() {this.tweening=false},this);
		}else if(this.piece_list[(piece.j+1)+'_'+piece.i] === undefined && (piece.j+1) < this.square) {
			// console.log('right');
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.j += 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = this.offsetX+piece.j*piece.width; 
			this.game.add.tween(piece).to({x: pos},this.speed, 'Linear', true).onComplete.add(function() {this.tweening=false},this);
		}else if(this.piece_list[piece.j+'_'+(piece.i-1)] === undefined && (piece.i-1) >=0) {
			// console.log('above');
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.i -= 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = this.offsetY+piece.i*piece.height; 
			this.game.add.tween(piece).to({y: pos},this.speed, 'Linear', true).onComplete.add(function() {this.tweening=false},this);
		}else if(this.piece_list[piece.j+'_'+(piece.i+1)] === undefined && (piece.i+1) < this.square) {
			// console.log('below');
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.i += 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = this.offsetY+piece.i*piece.height; 
			this.game.add.tween(piece).to({y: pos},this.speed, 'Linear', true).onComplete.add(function() {this.tweening=false},this);
		}

    if (this.checkWin() && this.scrambled) {
      // Wait for piece to finish moving then Add the missing piece if puzzle is solved
      this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() { 
        var piece = new PuzzlePiece(this.game, this.offsetX, this.offsetY, 0, 0, this.tile_width, this.tile_height,this.pic);
      }, this);

      this.solved = true;
    }

	},
  checkWin: function() {
    //For Each loop will return for each iteration, use For loop instead
    // this.pieces.forEach(function(piece) {
    //   console.log(piece.i !== piece.initialI || piece.j !== piece.initialJ);
    //   if (piece.i !== piece.initialI || piece.j !== piece.initialJ) {
    //     return false;
    //   }
    // }, this);  
    for(var x=0; x < this.pieces.length;x++) {
      if (this.pieces[x].i !== this.pieces[x].initialI || this.pieces[x].j !== this.pieces[x].initialJ) {
        return false;
      }
    }
    return true;
  },
};

