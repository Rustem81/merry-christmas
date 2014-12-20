/*
  Little fail here. We're applying a chroma key using putImageData, but this doesn't allow us to have a "real" alpha on the image.
  That's because putImageData doesn't use compositing.

  There might be better way to do this, but for the moment we'll just set chroma key color to the background one.

  - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing
  - http://stackoverflow.com/questions/5942141/mask-for-putimagedata-with-html5-canvas
 */

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth;
    height = window.innerHeight,
    player = {
      x : width/2,
      y : height - 5,
      width : 5,
      height : 5,
      speed: 3,
      velX: 0,
      velY: 0,
      jumping: false
    },
    keys = [],
    friction = 0.8,
    gravity = 0.3,
    background_tile_height = 350,
    background_color = {
      red: 0,
      green: 0,
      blue: 255,
      alpha: 255,
    };

canvas.width = width;
canvas.height = height;

var background = new Image();
background.src = "background.png";

function update(){
  // check keys
    if (keys[38] || keys[32]) {
        // up arrow or space
      if(!player.jumping){
       player.jumping = true;
       player.velY = -player.speed*2;
      }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }
   
    player.velX *= friction;
   
    player.velY += gravity;
  
    player.x += player.velX;
    player.y += player.velY;
    
    if (player.x >= width-player.width) {
        player.x = width-player.width;
    } else if (player.x <= 0) {
        player.x = 0;
    }
  
    if(player.y >= height-player.height){
        player.y = height - player.height;
        player.jumping = false;
    }
  
  ctx.clearRect(0,0,width,height);

  ctx.fillStyle = "rgba(" + background_color.red + ", " + background_color.green + ", " + background_color.blue + ", " + background_color.alpha + ")";
  ctx.fillRect(0, 0, width, height);

  // background image
  ctx.save();
  var ptrn = ctx.createPattern(background,'repeat-x');
  ctx.fillStyle = ptrn;
  ctx.translate(0, height - background_tile_height);
  ctx.fillRect(0, 0, width, background_tile_height);
  // chroma key
  var imageData = ctx.getImageData(0, height - background_tile_height, width, background_tile_height);
  var data = imageData.data;
  var start = {
      red: data[0],
      green: data[1],
      blue: data[2]
  };

  // iterate over all pixels
  for(var i = 0, n = data.length; i < n; i += 4) {
      var sameRed = data[i] === start.red;
      var sameGreen = data[i + 1] === start.green;
      var sameBlue = data[i + 2] === start.blue;
      if (sameRed && sameGreen && sameBlue) {
        data[i] = background_color.red;
        data[i + 1] = background_color.green;
        data[i + 2] = background_color.blue;
        data[i + 3] = background_color.alpha;
      }
  }
  ctx.putImageData(imageData, 0, height - background_tile_height);
  ctx.restore();
  
  // red dot
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
    
  requestAnimationFrame(update);
}

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});


window.addEventListener("load",function(){
    update();
});