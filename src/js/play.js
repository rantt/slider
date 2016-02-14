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


    var square = 5;
    var w = 800;
    var h = 500;

    var tile_width = w/square;
    var tile_height = h/square;

    this.arrowbmd = this.game.add.bitmapData(tile_width,tile_height);
    this.arrowbmd.ctx.clearRect(0,0,tile_width,tile_height);
    this.arrowbmd.ctx.strokeStyle = '#FFF';
    this.arrowbmd.ctx.fillStyle = '#000';
    this.arrowbmd.ctx.lineWidth = 2;
    this.arrowbmd.ctx.fill();
    this.arrowbmd.ctx.beginPath();
    this.arrowbmd.ctx.moveTo(tile_width*1/2,0);
    this.arrowbmd.ctx.lineTo(0,tile_height*1/2);
    this.arrowbmd.ctx.lineTo(tile_width*1/4,tile_height*1/2);
    this.arrowbmd.ctx.lineTo(tile_width*1/4,tile_height);
    this.arrowbmd.ctx.lineTo(tile_width*3/4,tile_height);
    this.arrowbmd.ctx.lineTo(tile_width*3/4,tile_height*1/2);
    this.arrowbmd.ctx.lineTo(tile_width,tile_height*1/2);
    this.arrowbmd.ctx.fill();

    var pieces = [];

    for (var i = 0; i < square;i++) {
      for (var j = 0; j < square;j++) {
        var img = this.game.make.bitmapData(160, 100);
        area = new Phaser.Rectangle(j*tile_width, i*tile_height, 160, 100);
        img.copyRect('bg1', area, 0, 0);
        img.update();

        // var img = this.game.make.bitmapData(800, 500);
        // img.draw(this.game.cache.getImage('bg1'), 0, 0);
        // img.update();

        // var bmd = this.game.make.bitmapData(800, 500);
        // bmd.addToWorld();
        // area = new Phaser.Rectangle(j*tile_width, i*tile_height, 160, 100);
        // bmd.copyRect('bg1', area, j*tile_width , i*tile_height);
        // bmd.copyRect('bg1', area, j*tile_width , i*tile_height);

        var mask = this.game.make.bitmapData(160, 100);
        mask.copyRect(this.arrowbmd, area, 160, 100);

        var bmd = this.game.make.bitmapData(160, 100);
        bmd.alphaMask(img, this.arrowbmd);
        // bmd.alphaMask(img, mask);



        var b = game.add.sprite(Game.w/2, Game.h/2, bmd);
        // var b = game.add.sprite(Game.w/2, Game.h/2, img);
        b.inputEnabled = true;
        b.input.enableDrag(true);
        // b.crop(area);
        pieces.push(b);

      }
    }
    
    
    // OLD
    // var square = 5;
    // var w = 800;
    // var h = 500;
    //
    // var tile_width = w/square;
    // var tile_height = h/square;
    // var pieces = [];
    //
    // for (var i = 0; i < square;i++) {
    //   for (var j = 0; j < square;j++) {
    //     var bmd = this.game.make.bitmapData(800, 500);
    //     bmd.addToWorld();
    //     area = new Phaser.Rectangle(j*tile_width, i*tile_height, 160, 100);
    //     bmd.copyRect('bg1', area, j*tile_width , i*tile_height);
    //     var b = game.add.sprite(Game.w/2, Game.h/2, bmd);
    //     b.inputEnabled = true;
    //     b.input.enableDrag(true);
    //     b.crop(area);
    //     pieces.push(b);
    //   }
    // }


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
