/*
  Little fail here. We're applying a chroma key using putImageData, but this doesn't allow us to have a "real" alpha on the image.
  That's because putImageData doesn't use compositing.

  There might be better way to do this, but for the moment we'll just set chroma key color to the background one.

  - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing
  - http://stackoverflow.com/questions/5942141/mask-for-putimagedata-with-html5-canvas
 */
var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  width = window.innerWidth;
  height = Math.min(window.innerHeight, 550);
  player = cm_get_mario(width, height),
  keys = [],
  background_tile_height = 320,
  background_color = {
    red: 107,
    green: 146,
    blue: 185,
    alpha: 255,
  };

player.x = width / 2;
player.y = height - 5;

// Snowflakes
var max_snowflakes = 25;
var snowflakes_angle = 0;
var snowflakes = cs_get_snowflakes(max_snowflakes);

canvas.width = width;
canvas.height = height;

var background = new Image();
background.src = "background.png";

function resize_canvas() {
  width = window.innerWidth;
  height = Math.min(window.innerHeight, 550);

  canvas.width = width;
  canvas.height = height;
}

function write_greetings(context) {
  context.save();

  var font_height = 40;
  var top_margin_ratio = 2.22;
  var margin_vertical_ratio = 1.81;

  var second_line = "and a Happy New Year";

  var correction = 0.9;
  if (second_line.length * font_height * correction > width) {
    font_height = width / (second_line.length * correction);
  }

  var top_margin = font_height / top_margin_ratio;
  var margin_vertical = font_height / margin_vertical_ratio;

  context.font = font_height + "pt SuperMario";
  context.fillStyle = 'Snow';

  context.textAlign = 'center';

  context.shadowBlur = 3;
  context.shadowColor = "SkyBlue";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 3;

  var title_y = font_height + margin_vertical + top_margin;
  context.fillText('Merry Christmas', width / 2, title_y);

  title_y += font_height + margin_vertical
  context.fillText(second_line, width / 2, title_y);

  context.restore();
}

function update() {
  // update state
  // don't move for now
  // cm_update_mario_for_keys(player, keys);

  // redraw
  ctx.clearRect(0,0,width,height);

  ctx.fillStyle = "rgba(" + background_color.red + ", " + background_color.green + ", " + background_color.blue + ", " + background_color.alpha + ")";
  ctx.fillRect(0, 0, width, height);

  // background image, repeated, stuck to bottom, and chromakeyed
  ctx.save();

  // 1. repeat
  var ptrn = ctx.createPattern(background,'repeat-x');
  ctx.fillStyle = ptrn;

  // 2. stick to bottom
  ctx.translate(0, height - background_tile_height);
  ctx.fillRect(0, 0, width, background_tile_height);

  // 3. chroma key
  var imageData = ctx.getImageData(0, height - background_tile_height, width, background_tile_height);
  ck_change_imagedata_background_color(imageData, background_color);
  ctx.putImageData(imageData, 0, height - background_tile_height);

  ctx.restore();

  // mario
  cm_draw_mario(mario, ctx);

  write_greetings(ctx);

  // snowflakes
  cs_draw_snowflakes(ctx, snowflakes);
  snowflakes_angle += 0.01;
  cs_update_snowflakes(snowflakes_angle, snowflakes);
}

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});


window.addEventListener("load", function(){
  setInterval(update, 33);
  setInterval(cm_update_mario, 400, mario);
});

window.addEventListener("resize", function() {
  resize_canvas();
});
