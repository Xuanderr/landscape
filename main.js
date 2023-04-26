import {PolygonDrawer} from "./module/polygon.js";


export {canvas, managingInfo};
const initCanvas = (workSpace, container) => {
  return new fabric.Canvas(workSpace, {
    width: window.innerWidth,
    height: window.innerHeight,
    renderOnAddRemove: true
  });
};
//document.getElementById(container).clientWidth
const setCanvasBackgroundGrid = (url, canvas) => {
  canvas.setBackgroundColor(
    {
      source: url,
      /*repeat: "repeat", crossOrigin: null*/
      crossOrigin: null,
    },
    canvas.renderAll.bind(canvas)
  );
};

const constants = {
  workSpace: "work-space",
  container: "container",
  backgroundUrl: "./img/grid.svg",
};

const managingInfo = {
  polygon: undefined
}

const projectOptions = {
  currentMode: "default",
};

const eventActions = {
  canvasZoomAction: (options) => {
    let delta = options.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
    options.e.preventDefault();
    options.e.stopPropagation();
  },
  windowResizeAction: () => {
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight);
  }
};
const actionSetter = {
  setCanvasZoom: () => {
    canvas.on("mouse:wheel", eventActions.canvasZoomAction);
  },
  setWindowResize: () => {
    window.addEventListener("resize", eventActions.windowResizeAction);
  },
  setPolygonBackground: () => {
    Array.from(document.getElementsByClassName('sub-menu-item-img')).forEach((element) => {
      element.addEventListener('click', (event) => {
        let str = `img/plot-background/${event.currentTarget.alt}.png`;
        console.log(event.currentTarget.alt);
        loadPattern(str)
      })
    })
  },
  setExplorerOpenClose: () => {
    let explorer = document.querySelectorAll(".explorer")[0];
    if (explorer) {
      explorer.addEventListener('click', () => {
        explorer.classList.remove('close');
        explorer.classList.add('open');
      })
    }
    Array.from(explorer.children).forEach((element) => {
      if (element.classList.contains('icon-close')) {
        element.addEventListener('click', (event) => {
          event.stopPropagation();
          explorer.classList.remove('open');
          explorer.classList.add('close');
        })
      }
    })
  }
};

const loadPattern = (url) => {
  if(managingInfo.polygon) {
    fabric.util.loadImage(url, function (img) {
      managingInfo.polygon.set({
        fill: new fabric.Pattern({source: img }),
        opacity: 1
      }
      );
      canvas.renderAll();
    });
  }

}

const canvas = initCanvas(constants.workSpace, constants.container);
setCanvasBackgroundGrid(constants.backgroundUrl, canvas);
actionSetter.setWindowResize();
actionSetter.setCanvasZoom();
actionSetter.setPolygonBackground();
actionSetter.setExplorerOpenClose();

// let circle = new fabric.Circle({
//   left: 300,
//   top: 300,
//   radius: 40,
//   backgroundColor: 'red'
// });
// circle.setBackgroundColor( {
//       source: './img/checkmark.svg',
//       /*repeat: "repeat", crossOrigin: null*/
//       crossOrigin: null,
//     },
//     canvas.renderAll.bind(circle)
// )
// rect.on("moving", () => {
//   if (rect.intersectsWithObject(line, true, false)) {
//     console.log("kek");
//   }
//   console.log("1");
// });
// line.on("mouseover", (options) => {
//   if (
//     line.containsPoint(new fabric.Point(options.point.x, options.pointer.y))
//   ) {
//     console.log("kek");
//   }

//   // line.set({
//   //   stroke: "red",
//   // });
//   canvas.renderAll();
// });
// line.on("mouseout", () => {
//   console.log("kek1");
//   line.set({
//     stroke: "green",
//   });
//   canvas.renderAll();
// });
// canvas.add(line, rect);
// console.log(line);
// console.log(rect);
const btn = document.getElementById("addBtn");
btn.addEventListener("click", () => {
  if (projectOptions.currentMode === "default") {
    projectOptions.currentMode = "polygon";
    PolygonDrawer.eventSetter();
  } else {
    projectOptions.currentMode = "default";
    PolygonDrawer.eventRemover();
  }
});


