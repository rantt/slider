function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Puzzle = function(game, pic, square) {
    this.game = game;

    this.solved = false;

    this.rndAmount = 1;
    this.pic = pic;

    this.square = square;
    var src_image = this.game.add.image(0, 0, pic);
    src_image.visible = false;

    var w = src_image.width;
    var h = src_image.height;


    this.tile_width = Math.floor(w/this.square);
    this.tile_height = Math.floor(h/this.square);

    this.pieces = [];
    this.background = [];
		this.piece_list = {};
    for (var i = 0; i < this.square;i++) {
      for (var j = 0; j < this.square;j++) {
        this.background.push(this.makeBox(100+j*this.tile_width, 100+i*this.tile_height,this.tile_width, this.tile_height));
			}
		}

    for (var i = 0; i < this.square;i++) {
      for (var j = 0; j < this.square;j++) {
				
				if ((i !== 0) || (j !== 0)) {
					var piece = new PuzzlePiece(this.game, 100+j*this.tile_width, 100+i*this.tile_height, j, i, this.tile_width, this.tile_height,pic);
					piece.events.onInputUp.add(this.movePiece, this);
					this.piece_list[j+'_'+i] = piece;
          this.pieces.push(piece);
				}

      }
    }
		// console.log(this.piece_list);

};

Puzzle.prototype = Puzzle.prototype.constructor = Puzzle;
Puzzle.prototype = {
  randomize: function() {
  },
  destroy: function() {
    this.pieces.forEach(function(piece) {
      if (piece != undefined) {
        piece.destroy();
      }
    }, this);
   this.background.forEach(function(piece) {
      // if (piece != undefined) {
        piece.destroy();
      // }
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
	movePiece: function(piece) {
    if (this.solved) {return;}
		// console.log((piece.j)+'_'+piece.i);
		// console.log(this.piece_list[(piece.j-1)+'_'+piece.i]);

		if (this.piece_list[(piece.j-1)+'_'+piece.i] === undefined && (piece.j-1) >= 0) {
			console.log('left');
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.j -= 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = 100+piece.j*piece.width; 
			this.game.add.tween(piece).to({x: pos},500).start();
		}else if(this.piece_list[(piece.j+1)+'_'+piece.i] === undefined && (piece.j+1) < this.square) {
			console.log('right');
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.j += 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = 100+piece.j*piece.width; 
			this.game.add.tween(piece).to({x: pos},500).start();
		}else if(this.piece_list[piece.j+'_'+(piece.i-1)] === undefined && (piece.i-1) >=0) {
			console.log('above');
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.i -= 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = 100+piece.i*piece.height; 
			this.game.add.tween(piece).to({y: pos},500).start();
		}else if(this.piece_list[piece.j+'_'+(piece.i+1)] === undefined && (piece.i+1) < this.square) {
			console.log('below');
			this.piece_list[piece.j+'_'+piece.i] = undefined;
			piece.i += 1;
			this.piece_list[piece.j+'_'+piece.i] = piece;
			var pos = 100+piece.i*piece.height; 
			this.game.add.tween(piece).to({y: pos},500).start();
		}
    var c = this.checkWin();
    console.log('win '+ c);
    if (this.checkWin()) {
      var piece = new PuzzlePiece(this.game, 100, 100, 0, 0, this.tile_width, this.tile_height,this.pic);
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

