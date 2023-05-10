import {PolygonDrawer} from "./module/polygon.js";


export {canvas, managingInfo, functions, actionSetter};
const initCanvas = (workSpace, container) => {
  return new fabric.Canvas(workSpace, {
    width: window.innerWidth,
    height: window.innerHeight,
    renderOnAddRemove: true,
    selection: false,
    preserveObjectStacking: true
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
}

const projectOptions = {
  currentMode: "default",
  popup: document.getElementsByClassName('popup')[0],
  popupMessage: document.getElementById('popupMessage')
};


const eventActions = {
  getItemFromElement: (text, element, forCopy) => {
    let height = Number(element.firstElementChild.dataset.height),
        width = Number(element.firstElementChild.dataset.width),
        about = element.dataset.about,
        squareType = element.firstElementChild.dataset.squareType,
        copySquare = undefined;
    if (forCopy) {
      height = Number(forCopy.height) * 25;
      width = Number(forCopy.width) * 25;
      copySquare = forCopy.square;
    }
    fabric.Image.fromURL(`img/${text}/${element.firstElementChild.alt}.png`, (img) => {
      let infoBox = functions.createInfoBox(about, width, height, squareType, img, copySquare);
      img.set({
        left:canvas.getCenter().left,
        top: canvas.getCenter().top,
        borderColor: '#00ffd5',
        cornerColor: '#00ffd5',
        cornerStyle: 'circle',
        transparentCorners: false,
        info: infoBox.main,
        squareInfo: infoBox.squareInfo,
        heightInfo: infoBox.heightInfo,
        widthInfo: infoBox.widthInfo,
        squareType: squareType,
        sourceImagePath: {
          text: text,
          element: element
        }
      });
      img.scaleToHeight(Number(height));
      img.scaleToWidth(Number(width));
      if (forCopy) {
        img.set({
          scaleX: forCopy.scaleX,
          scaleY: forCopy.scaleY
        })
        canvas.renderAll();
      }
      img.on('selected', () => {
        if (img.info.classList.contains('none')) {
          img.info.classList.remove('none')
        }
      });
      img.on('deselected', () => {
        if (!img.info.classList.contains('none')) {
          img.info.classList.add('none')
        }
      });
      img.on('scaling', () => {
        let currentInfo = functions.getCurrentItemInfo(img._getCoords(true), img.squareType);
        img.heightInfo.textContent = currentInfo.height.toFixed(2);
        img.widthInfo.textContent = currentInfo.width.toFixed(2);
        img.squareInfo.textContent = currentInfo.square;
      });
      canvas.add(img);
      canvas.setActiveObject(img);
    });
  }
};
const actionSetter = {
  setCanvasZoom: () => {
    canvas.on("mouse:wheel", (options) => {
      let delta = options.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({x: options.e.offsetX, y: options.e.offsetY}, zoom);
      options.e.preventDefault();
      options.e.stopPropagation();
    });
  },
  setCanvasPanning: () => {
    canvas.on('mouse:down', function(options) {
      let evt = options.e;
      if (evt.altKey === true) {
        canvas.isDragging = true;
        canvas.lastPosX = evt.clientX;
        canvas.lastPosY = evt.clientY;
      }
    });
    canvas.on('mouse:move', function(options) {
      if (this.isDragging) {
        let e = options.e;
        let vpt = this.viewportTransform;
        vpt[4] += e.clientX - canvas.lastPosX;
        vpt[5] += e.clientY - canvas.lastPosY;
        canvas.requestRenderAll();
        canvas.lastPosX = e.clientX;
        canvas.lastPosY = e.clientY;
      }
    });
    canvas.on('mouse:up', function() {
      canvas.setViewportTransform(canvas.viewportTransform);
      canvas.isDragging = false;
    });
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
  setAddPlot: () => {
    let addRectPlot = document.getElementById('addRectPlotBtn');
    let addPolyPlot = document.getElementById('addPolyPlotBtn');
    addRectPlot.addEventListener('click', () => {
      if(!managingInfo.polygon) {
        if(canvas.__eventListeners['mouse:down'] || canvas.__eventListeners['mouse:move']) {
          if(canvas.__eventListeners['mouse:down'].length > 0 || canvas.__eventListeners['mouse:move'].length > 0) {
            PolygonDrawer.eventRemover();
          }
        }
        PolygonDrawer.setMode('rect');
        return;
      }
      functions.fireAlert('Участок уже добавлен!');
    });
    addPolyPlot.addEventListener('click', () => {
      if (!managingInfo.polygon) {
        if(canvas.__eventListeners['mouse:down'] || canvas.__eventListeners['mouse:move']) {
          if(canvas.__eventListeners['mouse:down'].length > 0 || canvas.__eventListeners['mouse:move'].length > 0) {
            PolygonDrawer.eventRemover();
          }
        }
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
      canvas.setActiveObject(managingInfo.polygon);
      canvas.renderAll();
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
  },
  setOpenItemPreview: (item) => {
    item.addEventListener('click', () => {
      if(item.classList.contains('full-text')) {
        item.classList.remove('full-text');
        return;
      }
      item.classList.add('full-text');
    })
  },
  downloadPlan: () => {
    let btn = document.getElementById('btn');
    btn.addEventListener('click', () => {
      btn.firstElementChild.setAttribute('href', canvas.toDataURL());
      btn.firstElementChild.setAttribute('download', 'studio-landscape-project.png');
      btn.firstElementChild.click();
    })
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
  },
  getSquare: (height, width, type) => {
    switch (type) {
      case 'c':
        return (Math.PI * (height/50) * (width/50)).toFixed(2);
      case 'r':
        return ((height/25) * (width/25)).toFixed(2);
    }
  },
  getCurrentItemInfo: (coords, type) => {
    let height = functions.getLengthByCoords(coords.tl, coords.bl),
        width = functions.getLengthByCoords(coords.tl, coords.tr),
        square = functions.getSquare(height, width, type);
    return {
      height: height / 25,
      width: width / 25,
      square: square
    }
  },
  getLengthByCoords: (point1, point2) => {
    return Math.sqrt((point2.x - point1.x)**2 + (point2.y - point1.y)**2)
  },
  getInfoPoly: (linesArray) => {
    let rowsArray = [];
    linesArray.forEach((element, index) => {
      let explorerInfoRow = document.createElement('div');
      explorerInfoRow.classList.add('explorer-info-row', 'pointer');
      let span = document.createElement('span');
      span.textContent = `${index+1} сторона (м)`;
      let spanValue = document.createElement('span');
      spanValue.textContent = element.getText().split('m')[0];
      explorerInfoRow.append(span, spanValue);
      explorerInfoRow.addEventListener('click', () => {
        let line = new fabric.Line(element.getCoords(),{
          strokeWidth: 5,
          stroke: '#f59421',
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false
        });
        canvas.add(line);
        setTimeout(() => {
          canvas.remove(line);
        }, 2000);
      })
      rowsArray.push(explorerInfoRow)
    })
    return rowsArray;
  },
  getInfoRect: (linesArray) => {
    let rowsArray = [];
    let explorerInfoRowLength = document.createElement('div');
    explorerInfoRowLength.classList.add('explorer-info-row', 'pointer');
    let spanLength = document.createElement('span');
    spanLength.textContent = 'Длина (м)';
    let spanLengthValue = document.createElement('span');
    spanLengthValue.textContent = linesArray[0].getText().split('m')[0];
    explorerInfoRowLength.append(spanLength, spanLengthValue);
    explorerInfoRowLength.addEventListener('click', () => {
      let line = new fabric.Line(linesArray[0].getCoords(), {
        strokeWidth: 5,
        stroke: '#f59421'
      });
      canvas.add(line);
      setTimeout(() => {
        canvas.remove(line);
      }, 2000);
    });
    let explorerInfoRowWidth = document.createElement('div');
    explorerInfoRowWidth.classList.add('explorer-info-row', 'pointer');
    let spanWidth = document.createElement('span');
    spanWidth.textContent = 'Ширина (м)';
    let spanWidthValue = document.createElement('span');
    spanWidthValue.textContent = linesArray[1].getText().split('m')[0];
    explorerInfoRowWidth.setAttribute('data-x1', linesArray[1].getCoords()[0].toString());
    explorerInfoRowWidth.setAttribute('data-y1', linesArray[1].getCoords()[1].toString());
    explorerInfoRowWidth.setAttribute('data-x2', linesArray[1].getCoords()[2].toString());
    explorerInfoRowWidth.setAttribute('data-y2', linesArray[1].getCoords()[3].toString());
    explorerInfoRowWidth.append(spanWidth, spanWidthValue);
    explorerInfoRowWidth.addEventListener('click', () => {
      let line = new fabric.Line(linesArray[1].getCoords(), {
        strokeWidth: 5,
        stroke: '#f59421'
      });
      canvas.add(line);
      setTimeout(() => {
        canvas.remove(line);
      }, 2000);
    });
    rowsArray.push(explorerInfoRowLength, explorerInfoRowWidth);
    return rowsArray;
  },
  createInfoBox: (preview, width, height, type, item, copySquare) => {
    let body = document.getElementsByTagName('body')[0];
    let explorer = document.createElement('div');
    explorer.classList.add('explorer', 'none');
    body.append(explorer);
    let explorerPreview = document.createElement('span');
    explorerPreview.className = 'explorer-preview';
    explorerPreview.textContent = preview;
    actionSetter.setOpenItemPreview(explorerPreview);
    let explorerTools = document.createElement('div');
    explorerTools.className = 'explorer-tools';
    let explorerInfo = document.createElement('div');
    explorerInfo.className = 'explorer-info';
    explorer.append(explorerPreview, explorerTools, explorerInfo);

    let explorerToolsRowFirst = document.createElement('div');
    let explorerToolsRowLast = document.createElement('div');
    explorerToolsRowFirst.className = 'explorer-tools-row';
    explorerToolsRowLast.className = 'explorer-tools-row';
    explorerTools.append(explorerToolsRowFirst, explorerToolsRowLast);

    let iconCopy = document.createElement('span');
    iconCopy.className = 'icon-copy';
    iconCopy.addEventListener('click', () => {
      let forCopy = {
        scaleX: item.scaleX,
        scaleY: item.scaleY,
        height: item.heightInfo.textContent,
        width: item.widthInfo.textContent,
        square: item.squareInfo.textContent
      }
      eventActions.getItemFromElement(item.sourceImagePath.text,item.sourceImagePath.element, forCopy);
    });
    let iconUpChevron = document.createElement('span');
    iconUpChevron.className = 'icon-up-chevron';
    iconUpChevron.addEventListener('click', () => {
      canvas.bringForward(item, true);
      canvas.renderAll();
    })
    let iconDoubleUpChevron = document.createElement('span');
    iconDoubleUpChevron.className = 'icon-double-up-chevron';
    iconDoubleUpChevron.addEventListener('click', () => {
      canvas.bringToFront(item);
    })
    explorerToolsRowFirst.append(iconCopy, iconUpChevron, iconDoubleUpChevron);

    let iconDelete = document.createElement('span');
    iconDelete.className = 'icon-delete';
    iconDelete.addEventListener('click', () => {
      canvas.remove(item);
    })
    let iconDownChevron = document.createElement('span');
    iconDownChevron.className = 'icon-down-chevron';
    iconDownChevron.addEventListener('click', () => {
      canvas.sendBackwards(item, true);
    })
    let iconDoubleDownChevron = document.createElement('span');
    iconDoubleDownChevron.className = 'icon-double-down-chevron';
    iconDoubleDownChevron.addEventListener('click', () => {
      canvas.sendToBack(item);
    })
    explorerToolsRowLast.append(iconDelete, iconDownChevron, iconDoubleDownChevron);

    let explorerInfoRow1 = document.createElement('div');
    explorerInfoRow1.className = 'explorer-info-row';
    let squareSpan = document.createElement('span');
    squareSpan.textContent = 'Площадь (кв.м)'
    let squareSpanValue = document.createElement('span');
    if(copySquare) {
      squareSpanValue.textContent = copySquare;
    } else {
      squareSpanValue.textContent = functions.getSquare(height, width, type);
    }
    explorerInfoRow1.append(squareSpan, squareSpanValue);

    let explorerInfoRow2 = document.createElement('div');
    explorerInfoRow2.className = 'explorer-info-row';
    let heightSpan = document.createElement('span');
    heightSpan.textContent = 'Длина (м)';
    let heightSpanValue = document.createElement('span');

    heightSpanValue.textContent = (height / 25).toString();
    explorerInfoRow2.append(heightSpan, heightSpanValue);

    let explorerInfoRow3 = document.createElement('div');
    explorerInfoRow3.className = 'explorer-info-row';
    let widthSpan = document.createElement('span');
    widthSpan.textContent = 'Ширина (м)';
    let widthSpanValue = document.createElement('span');
    widthSpanValue.textContent = (width / 25).toString();
    explorerInfoRow3.append(widthSpan, widthSpanValue);
    explorerInfo.append(explorerInfoRow1, explorerInfoRow2, explorerInfoRow3);
    return {
      main: explorer,
      squareInfo: squareSpanValue,
      heightInfo: heightSpanValue,
      widthInfo: widthSpanValue
    }
  },
  createPlotInfoBox: (item, plotType) => {
    let body = document.getElementsByTagName('body')[0];
    let explorer = document.createElement('div');
    explorer.classList.add('explorer', 'none');
    body.append(explorer);
    let explorerPreview = document.createElement('span');
    explorerPreview.className = 'explorer-preview';
    explorerPreview.textContent = 'Участок';
    actionSetter.setOpenItemPreview(explorerPreview);

    let explorerTools = document.createElement('div');
    explorerTools.className = 'explorer-tools-plot';
    let explorerInfo = document.createElement('div');
    explorerInfo.className = 'explorer-info';
    explorer.append(explorerPreview, explorerTools, explorerInfo);

    let iconDelete = document.createElement('span');
    iconDelete.className = 'icon-delete';
    iconDelete.addEventListener('click', () => {
      canvas.remove(item);
      managingInfo.polygon = undefined;
    })
    let explorerToolsPlotItemFirst = document.createElement('div');
    let explorerToolsPlotItemSecond = document.createElement('div');
    explorerToolsPlotItemFirst.className = 'explorer-tools-plot-item';
    explorerToolsPlotItemSecond.className = 'explorer-tools-plot-item';
    explorerTools.append(iconDelete, explorerToolsPlotItemFirst, explorerToolsPlotItemSecond);

    let iconUpChevron = document.createElement('span');
    iconUpChevron.className = 'icon-up-chevron';
    iconUpChevron.addEventListener('click', () => {
      canvas.bringForward(item, true);
    })
    let iconDownChevron = document.createElement('span');
    iconDownChevron.className = 'icon-down-chevron';
    iconDownChevron.addEventListener('click', () => {
      canvas.sendBackwards(item, true);
    })
    explorerToolsPlotItemFirst.append(iconUpChevron, iconDownChevron);
    let iconDoubleUpChevron = document.createElement('span');
    iconDoubleUpChevron.className = 'icon-double-up-chevron';
    iconDoubleUpChevron.addEventListener('click', () => {
      canvas.bringToFront(item);
    })
    let iconDoubleDownChevron = document.createElement('span');
    iconDoubleDownChevron.className = 'icon-double-down-chevron';
    iconDoubleDownChevron.addEventListener('click', () => {
      canvas.sendToBack(item);
    })
    explorerToolsPlotItemSecond.append(iconDoubleUpChevron, iconDoubleDownChevron);

    let explorerInfoRowSquare = document.createElement('div');
    explorerInfoRowSquare.className = 'explorer-info-row';
    let squareSpan = document.createElement('span');
    squareSpan.textContent = 'Площадь (кв.м)'
    let squareSpanValue = document.createElement('span');
    squareSpanValue.textContent = item.square;
    explorerInfoRowSquare.append(squareSpan, squareSpanValue);
    explorerInfo.append(explorerInfoRowSquare);
    switch (plotType) {
      case 'p':
        functions.getInfoPoly(item.labeledLines).forEach((element) => {
          explorerInfo.append(element);
        })
        break;
      case 'r':
        functions.getInfoRect(item.labeledLines).forEach((element) => {
          explorerInfo.append(element);
        })
        break;
    }
    return explorer;
  }
}
// function toggleExplorerItem() {
//   Array.from(document.getElementsByClassName('explorer-item')).forEach((item) => {
//     let itemPreview = undefined;
//     let itemTools = undefined;
//     Array.from(item.children).forEach((element) => {
//       if (element.classList.contains('explorer-item-preview')) {
//         itemPreview = element;
//       }
//       if (element.classList.contains('explorer-item-tool-container')) {
//         itemTools = element;
//       }
//     });
//     itemPreview.addEventListener('click', () => {
//       if(itemTools.classList.contains('none')) {
//         itemTools.classList.remove('none');
//         itemTools.classList.add('block');
//         itemPreview.classList.add('full-text');
//         return;
//       }
//       itemTools.classList.remove('block');
//       itemTools.classList.add('none');
//       itemPreview.classList.remove('full-text');
//     });
//   });
// }
function f() {
  Array.from(document.getElementsByClassName('explorer-preview')).forEach((item) => {
    item.addEventListener('click', () => {
      if(item.classList.contains('full-text')) {
        item.classList.remove('full-text');
        return;
      }
      item.classList.add('full-text');
    })
  });
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
actionSetter.setCanvasPanning();
actionSetter.setPolygonBackground();
actionSetter.downloadPlan();
actionSetter.setAddPlot();
actionSetter.setPopUpClick();
actionSetter.setAddItem();
//toggleExplorerItem();
f();

// let text =  new fabric.Text('label', {
//   left: 500, top: 300
// });
// canvas.add(text);
// console.log(text)
// let circle = new fabric.Circle({
//   radius: 20, fill: 'green', left: 500, top: 300
// });
// circle.on('selected', () => {
//   console.log('kek')
// })
// canvas.add(circle)
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


