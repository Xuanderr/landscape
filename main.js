let canvas = new fabric.Canvas("work_space", {
  width: document.getElementById("container").offsetWidth,
  height: document.getElementById("container").offsetHeight,
});

window.addEventListener("resize", resize);

function resize() {
  canvas.setWidth(document.getElementById("container").offsetWidth);
  canvas.setHeight(document.getElementById("container").offsetHeight);
}

$(document).ready(function () {
  var c = new fabric.Canvas(canvas, {
      selection: false,
      height: window.innerHeight,
      width: window.innerWidth,
    }),
    options = {
      distance: 10,
      width: c.width,
      height: c.height,
      param: {
        stroke: "#ebebeb",
        strokeWidth: 1,
        selectable: false,
      },
    },
    gridLen = options.width / options.distance;

  for (var i = 0; i < gridLen; i++) {
    var distance = i * options.distance,
      horizontal = new fabric.Line(
        [distance, 0, distance, options.width],
        options.param
      ),
      vertical = new fabric.Line(
        [0, distance, options.width, distance],
        options.param
      );
    c.add(horizontal);
    c.add(vertical);
    if (i % 5 === 0) {
      horizontal.set({ stroke: "#cccccc" });
      vertical.set({ stroke: "#cccccc" });
    }
  }
});
