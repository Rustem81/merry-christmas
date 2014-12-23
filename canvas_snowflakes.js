function cs_get_snowflakes(count) {
  var particles = [];
  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random()*width, //x-coordinate
      y: Math.random()*height, //y-coordinate
      r: Math.random()*4+1, //radius
      d: Math.random()*count //density
    });
  };

  return particles;
}

function cs_update_snowflakes(angle, snowflakes) {
  for(var i = 0; i < snowflakes.length; i++) {
    var p = snowflakes[i];
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
    if(p.x > W+5 || p.x < -5 || p.y > H) {
      if(i%3 > 0) { //66.67% of the flakes
        snowflakes[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
      } else {
        //If the flake is exitting from the right
        if(Math.sin(angle) > 0) {
          //Enter from the left
          snowflakes[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
        } else {
          //Enter from the right
          snowflakes[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
        }
      }
    }
  }
}

function  cs_draw_snowflakes(context, snowflakes) {
  context.fillStyle = "rgba(255, 255, 255, 0.8)";
  context.beginPath();
  for(var i = 0; i < max_snowflakes; i++) {
    var p = snowflakes[i];
    context.moveTo(p.x, p.y);
    context.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
  }
  context.fill();
}
