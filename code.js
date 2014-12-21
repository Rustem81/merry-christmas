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
  background_tile_height = 320,
  background_color = {
    red: 107,
    green: 146,
    blue: 185,
    alpha: 255,
  };

  //snowflake particles
  var mp = 25; //max particles
  var particles = [];
  for(var i = 0; i < mp; i++)
  {
    particles.push({
      x: Math.random()*width, //x-coordinate
      y: Math.random()*height, //y-coordinate
      r: Math.random()*4+1, //radius
      d: Math.random()*mp //density
    });
  };

canvas.width = width;
canvas.height = height;

var background = new Image();
background.src = "background.png";

var mario0 = new Image();
mario0.src = "mario_0.png";

var mario1 = new Image();
mario1.src = "mario_1.png";

var mario_frames = [ mario0, mario1 ];
var mario_index = 0;

//Function to move the snowflakes
  //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
  var angle = 0;
  function update_snowflakes()
  {
    angle += 0.01;
    for(var i = 0; i < mp; i++)
    {
      var p = particles[i];
      //Updating X and Y coordinates
      //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
      //Every particle has its own density which can be used to make the downward movement different for each flake
      //Lets make it more random by adding in the radius
      p.y += Math.cos(angle+p.d) + 1 + p.r/2;
      p.x += Math.sin(angle) * 2;

      var W = width;
      var H = height;
      
      //Sending flakes back from the top when it exits
      //Lets make it a bit more organic and let flakes enter from the left and right also.
      if(p.x > W+5 || p.x < -5 || p.y > H)
      {
        if(i%3 > 0) //66.67% of the flakes
        {
          particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
        }
        else
        {
          //If the flake is exitting from the right
          if(Math.sin(angle) > 0)
          {
            //Enter from the left
            particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
          }
          else
          {
            //Enter from the right
            particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
          }
        }
      }
    }
  }

function update() {
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
  // ctx.fillStyle = "red";
  // ctx.fillRect(player.x, player.y, player.width, player.height);

  // mario
  var mario_frame = mario_frames[mario_index];
  ctx.drawImage(mario_frame, player.x, player.y + player.height - mario_frame.height, mario_frame.width, mario_frame.height);

  ctx.save();
  var font_height = 40;
  var margin_vertical = 22;
  ctx.font = "italic " + font_height + "pt Calibri";
  ctx.fillStyle = 'Gold';
  ctx.textAlign = 'center';
  ctx.shadowBlur = 5;
  ctx.shadowColor = "DarkGoldenRod";
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 3;
  ctx.fillText('Merry Christmas', width / 2, font_height + margin_vertical);
  ctx.fillText('and a Happy New Year', width / 2, (font_height + margin_vertical) * 2);
  ctx.restore();
    
  // requestAnimationFrame(update);

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    for(var i = 0; i < mp; i++)
    {
      var p = particles[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
    }
    ctx.fill();
    update_snowflakes();
}

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});


window.addEventListener("load", function(){
  // update();
  setInterval(update, 33);
});