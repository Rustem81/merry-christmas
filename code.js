(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 512 * 2.5,
    height = 600,
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
    background_tile_height = 350;

canvas.width = width;
canvas.height = height;

var background = new Image();
background.src = "http://www.spriters-resource.com/resources/sheets/5/4796.png";

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

  // background image
  ctx.save();
  var ptrn = ctx.createPattern(background,'repeat-x');
  ctx.fillStyle = ptrn;
  ctx.translate(0, height - background_tile_height);
  ctx.fillRect(0, 0, width, background_tile_height);
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