function ck_change_imagedata_background_color(imageData, new_color) {
  var data = imageData.data;
  var start = {
    red: data[0],
    green: data[1],
    blue: data[2]
  };

  for(var i = 0, n = data.length; i < n; i += 4) {
    var sameRed = data[i] === start.red;
    var sameGreen = data[i + 1] === start.green;
    var sameBlue = data[i + 2] === start.blue;
    if (sameRed && sameGreen && sameBlue) {
      data[i] = new_color.red;
      data[i + 1] = new_color.green;
      data[i + 2] = new_color.blue;
      data[i + 3] = new_color.alpha;
    }
  }
}
