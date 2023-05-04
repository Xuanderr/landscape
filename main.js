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
  polygon: undefined,
  isPolygonToBe: false
}

const projectOptions = {
  currentMode: "default",
  popup: document.getElementsByClassName('popup')[0],
  popupMessage: document.getElementById('popupMessage')
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
  getItemFromElement: (text, element) => {
    fabric.Image.fromURL(`img/${text}/${element.firstElementChild.alt}.png`, (img) => {
      img.set({
        left:canvas.getCenter().left,
        top: canvas.getCenter().top
      });
      img.scaleToHeight(Number(element.firstElementChild.dataset.height));
      img.scaleToWidth(Number(element.firstElementChild.dataset.width));
      if (text === 'plants') {
        console.log(element.firstElementChild.alt)
        console.log(element.firstElementChild.dataset.height)
        console.log(element.firstElementChild.dataset.width)
        console.log(img)
      }
      canvas.add(img);
    });
  },


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
    Array.from(document.getElementsByClassName('plotBack')).forEach((element) => {
      Array.from(element.children).forEach((child) => {
        child.addEventListener('click', () => {
          functions.loadPattern(`img/plot-background/${child.firstElementChild.alt}.png`);
        })
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
      if(!managingInfo.polygon) {
        PolygonDrawer.setMode('rect');
        return;
      }
      console.log(managingInfo.polygon);
      functions.fireAlert('Участок уже добавлен!');
    });
    addPolyPlot.addEventListener('click', () => {
      if (!managingInfo.polygon) {
        PolygonDrawer.setMode('poly');
        return;
      }
      console.log(managingInfo.polygon);
      functions.fireAlert('Участок уже добавлен!');
    });
  },
  setPopUpClick: () => {
    let popupButton = document.getElementById('popupButton');
    popupButton.addEventListener('click', () => {
      if (!projectOptions.popup.classList.contains('none')) {
        projectOptions.popup.classList.add('none');
      }
    })
  },
  setAddItem: () => {
    //4m x 4m <=> 100px x 100px
    Array.from(document.getElementsByClassName('houses')).forEach((element) => {
      Array.from(element.children).forEach((child) => {
        child.addEventListener('click', () => {
          eventActions.getItemFromElement('houses',child);
        });
      })
    });
    Array.from(document.getElementsByClassName('plants')).forEach((element) => {
      Array.from(element.children).forEach((child) => {
        child.addEventListener('click', () => {
          eventActions.getItemFromElement('plants',child);
        });
      })
    });
    Array.from(document.getElementsByClassName('footpath')).forEach((element) => {
      Array.from(element.children).forEach((child) => {
        child.addEventListener('click', () => {
          eventActions.getItemFromElement('footpath',child);
        });
      })
    });
    Array.from(document.getElementsByClassName('any')).forEach((element) => {
      Array.from(element.children).forEach((child) => {
        child.addEventListener('click', () => {
          eventActions.getItemFromElement('any',child);
        });
      })
    });
  }
};
const functions = {
  fireAlert: (text) => {
    projectOptions.popupMessage.textContent = text;
    if (projectOptions.popup.classList.contains('none')) {
      projectOptions.popup.classList.remove('none');
    }
  },
  loadPattern: (url) => {
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
// fabric.Image.fromURL('img/plants/flowers.png', function(oImg) {
//   oImg.set({
//     left:200,
//     top:200
//   })
//   canvas.add(oImg);
//   console.log(oImg);
// });
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
actionSetter.setPopUpClick();
actionSetter.setAddItem();
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


