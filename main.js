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
  isPolygonToBe: false,
  currentMode: "default"
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
  getInfoFromElement: (element) => {

  }

};
const actionSetter = {
  setCanvasZoom: () => {
    canvas.on("mouse:wheel", eventActions.canvasZoomAction);
  },
  setWindowResize: () => {
    window.addEventListener("resize", () => {
      canvas.setWidth(window.innerWidth);
      canvas.setHeight(window.innerHeight);
    });
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
  },
  setAddPlot: () => {
    let addRectPlot = document.getElementById('addRectPlotBtn');
    let addPolyPlot = document.getElementById('addPolyPlotBtn');
    addRectPlot.addEventListener('click', () => {
      PolygonDrawer.setMode('rect');
    });
    addPolyPlot.addEventListener('click', () => {
      PolygonDrawer.setMode('poly');
    });
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
function toggleExplorerItem() {
  let explorerItem = document.getElementsByClassName('explorer-item')[0];
  let itemPreview = undefined;
  let itemTools = undefined;
  Array.from(explorerItem.children).forEach((element) => {
    if (element.classList.contains('explorer-item-preview')) {
      itemPreview = element;
    }
    if (element.classList.contains('explorer-item-tool-container')) {
      itemTools = element;
    }
  });
  itemPreview.addEventListener('click', () => {
    if(itemTools.classList.contains('none')) {
      itemTools.classList.remove('none');
      itemTools.classList.add('block');
      itemPreview.classList.add('full-text');
      return;
    }
    itemTools.classList.remove('block');
    itemTools.classList.add('none');
    itemPreview.classList.remove('full-text');
  });
}

function createNodes() {
  let explorer = document.getElementsByClassName('explorer-item-container')[0];
  for (let i = 0; i < 25; i++) {
    let div = document.createElement('div');
    div.className = 'explorer-item';
    let span1 = document.createElement('span');
    span1.className = 'explorer-item-category';
    span1.textContent = `Категория - ${i}`
    let span2 = document.createElement('span');
    span2.className = 'explorer-item-type';
    span2.textContent = `Тип - ${i}`
    div.append(span1, span2);
    explorer.append(div);
  }
}
fabric.Image.fromURL('img/any/trash.png', function(oImg) {
  oImg.set({
    left:200,
    top:200
  })
  canvas.add(oImg);
  console.log(oImg);
});
// function f() {
//   let imgInstance = new fabric.Image(imgElement, {
//     angle: 0,
//     position: 'absolute',
//     opacity: 1,
//     originX: 'left',
//     originY:'top',
//     meetOrSlice:'slice',
//
//   });
//   imgInstance.selectable = false;
//   canvas.add(imgInstance);
//   canvas.renderAll();
// }
const canvas = initCanvas(constants.workSpace, constants.container);
setCanvasBackgroundGrid(constants.backgroundUrl, canvas);
actionSetter.setWindowResize();
actionSetter.setCanvasZoom();
actionSetter.setPolygonBackground();
actionSetter.setExplorerOpenClose();
actionSetter.setAddPlot();
toggleExplorerItem();
// createNodes();
// f();
// const btn = document.getElementById("addBtn");
// btn.addEventListener("click", () => {
//   if (projectOptions.currentMode === "default") {
//     projectOptions.currentMode = "polygon";
//     PolygonDrawer.eventSetter();
//   } else {
//     projectOptions.currentMode = "default";
//     PolygonDrawer.eventRemover();
//   }
// });


