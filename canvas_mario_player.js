var friction = 0.8;
var gravity = 0.3;

var mario0 = new Image();
mario0.src = "mokagio_0.png";

var mario1 = new Image();
mario1.src = "mokagio_1.png";

var mario_frames = [ mario0, mario1 ];
var mario_index = 0;

var mario = {
  x : 0,
  y : 0,
  width : 5,
  height : 5,
  speed: 3,
  velX: 0,
  velY: 0,
  jumping: false,
  frame: 0
};

function cm_get_mario() {
  return mario;
}

function cm_update_mario_for_keys(player, keys) {
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
}

function cm_update_mario(mario) {
  mario.frame += 1;
  if (mario.frame >= mario_frames.length) {
    mario.frame = 0;
  }
}

function cm_draw_mario(mario, context) {
  var mario_frame = mario_frames[mario.frame];
  context.drawImage(mario_frame, player.x - mario_frame.width / 2, player.y + player.height - mario_frame.height, mario_frame.width, mario_frame.height);
}
