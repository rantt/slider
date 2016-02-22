/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

		this.menu_button = this.game.add.button(0,0,this.makeBox(200,50), this.gotoMenu,this);
		this.menu_button.tint = 0xff00ff;
		this.game.add.bitmapText(50,10,'minecraftia','Menu',24);

    this.game.stage.backgroundColor = '#2d2d2d';

    if (difficulty === 'easy') {
      this.square = 3;
      this.moves = 15;
    }else if (difficulty === 'normal') {
      this.square = 4;
      this.moves = 20;
    }else if (difficulty === 'hard') {
      this.square = 5;
      this.moves = 30;
    }

		this.puzzle = new Puzzle(this.game, level, this.square);

    this.playAgainText = this.game.add.bitmapText(Game.w/2 , Game.h/2, 'minecraftia','Click To Start',48);
    this.playAgainText.anchor.set(0.5);
    this.playAgainText.tint = 0xff00ff;

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(Game.w/2, Game.h-30,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = true;
  },
  update: function() {
    if (this.puzzle.solved === false) {
      if (this.game.input.activePointer.isDown && this.puzzle.scrambling === false) {
        this.playAgainText.setText('');
        this.puzzle.scramble(this.moves);
      }
    }else {
        this.game.input.onUp.add(this.gotoMenu,this);
        this.playAgainText.setText('GREAT JOB!\nClick to Play Again.');
        this.game.world.bringToTop(this.playAgainText);
    } 
  },
  gotoMenu: function() {
    this.game.state.start('Gallery');
  },
  makeBox: function(x,y) {
    var bmd = this.game.add.bitmapData(x, y);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, x, y);
    bmd.ctx.fillStyle = '#fff';
    bmd.ctx.fill();
    return bmd;
  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/slider/'; 
    var twitter_name = 'rantt_';
    var tags = [''];

    window.open('http://twitter.com/share?text=Relax+with+a+fun+sliding+puzzle.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },

};
