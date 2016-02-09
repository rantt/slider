/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var score = 0;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

    this.game.stage.backgroundColor = '#2d2d2d';

    // var bg1 = this.game.add.sprite(Game.w/2, Game.h/2, 'bg1');
    // var bg1 = this.game.add.image(Game.w/2, Game.h/2, 'bg1');
    // bg1.anchor.setTo(0.5);
    // console.log(bg1);

    //5x5

    // bmd = this.game.make.bitmapData(800, 500);
    // bmd.addToWorld();
    // area = new Phaser.Rectangle(0, 0, 800, 500);
    // bmd.copyRect('bg1', area, 0, 0); // image, phaser area, x pos, ypos

    var square = 5;
    var w = 800;
    var h = 500;

    var tile_width = w/square;
    var tile_height = h/square;
    var pieces = [];

    for (var i = 0; i < square;i++) {
      for (var j = 0; j < square;j++) {
        var bmd = this.game.make.bitmapData(800, 500);
        bmd.addToWorld();
        area = new Phaser.Rectangle(j*tile_width, i*tile_height, 160, 100);
        bmd.copyRect('bg1', area, j*tile_width , i*tile_height);
        var b = game.add.sprite(Game.w/2, Game.h/2, bmd);
        b.inputEnabled = true;
        b.input.enableDrag(true);
        b.crop(area);
        pieces.push(b);
      }
    }


    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);


    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },

  update: function() {

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/GAMETITLE/'; 
    var twitter_name = 'rantt_';
    var tags = ['1GAM'];

    window.open('http://twitter.com/share?text=My+best+score+is+'+score+'+playing+GAME+TITLE+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },

  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }

};
