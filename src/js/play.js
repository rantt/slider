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

    this.puzzles = ['cat','prehistory','skyscrapers','boxing'];
    this.won = false;

    this.level = 0;

		this.puzzle = new Puzzle(this.game, this.puzzles[this.level], this.square);

    this.playAgainText = this.game.add.bitmapText(Game.w/2 , Game.h/2, 'minecraftia','Click To Start',48);
    this.playAgainText.anchor.set(0.5);
    this.playAgainText.tint = 0xff00ff;

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(Game.w/2, Game.h-30,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = true;
  },
  update: function() {
    if (this.won === false) {
      if (this.game.input.activePointer.isDown && this.puzzle.scrambling === false) {
        this.playAgainText.setText('');
        this.puzzle.scramble(this.moves);
      }

      if (this.puzzle.solved === true) {
        this.playAgainText.setText('Click To Continue');
        this.game.world.bringToTop(this.playAgainText);

        this.game.input.onUp.add(this.nextLevel,this);

      }
    }else {
      this.playAgainText.setText('YOU WIN! Click To Play Again.');
      this.game.world.bringToTop(this.playAgainText);

       if (this.game.input.activePointer.isDown) {
        this.game.state.start('Menu');
      }
     
    }

  },
  nextLevel: function() {
    if (this.puzzle.solved === true) {
      this.level += 1;
      console.log('here'+this.level);
      if (this.level < this.puzzles.length) {
       this.puzzle.destroy();
        this.puzzle = new Puzzle(this.game, this.puzzles[this.level], this.square);
        this.playAgainText.setText('Click To Start');
        this.game.world.bringToTop(this.playAgainText);
      }else {
        this.won = true;
      }
    }
  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/slider/'; 
    var twitter_name = 'rantt_';
    var tags = [''];

    if (this.level >= this.puzzles.length) {
      window.open('http://twitter.com/share?text=I+beat+Slider+on+'+difficulty+'+mode+playing+Slider.+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
    }else {
      window.open('http://twitter.com/share?text=I+made+it+to+lvl+'+(this.level+1)+'+on+'+difficulty+'+mode+playing+Slider.+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
    }
  },

};
