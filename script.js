var canvas = document.getElementById("work_space");
canvas.width = window.outerWidth;
canvas.height = window.outerHeight;
ctx = canvas.getContext("2d");
var scale = 1;
//horizontal lines
for (var i = 0; i <= canvas.height; i += 10) {
  // начинаем рисовать
  ctx.beginPath();
  // ставим начальную точку
  ctx.moveTo(0, i);
  // указываем конечную точку для линии
  ctx.lineTo(canvas.width, i);
  // рисуем и выводим линию
  ctx.stroke();
}

//vertical lines
for (var i = 0; i <= canvas.width; i += 10) {
  // начинаем рисовать
  ctx.beginPath();
  // ставим начальную точку
  ctx.moveTo(i, 0);
  // указываем конечную точку для линии
  ctx.lineTo(i, canvas.height);
  // рисуем и выводим линию
  ctx.stroke();
}

ctx.strokeStyle = "#876f9e"; // Цвет обводки
ctx.lineWidth = 6; // Ширина линии
ctx.beginPath();
ctx.strokeRect(50, 50, 200, 200);
ctx.rotate(0.52);
ctx.strokeRect(50, 50, 200, 200);
ctx.closePath();
ctx.scale(2, 2);
ctx.beginPath();
ctx.strokeRect(50, 50, 200, 200);

// function moreScale() {
//   console.log("moreScale");
//   scale += 0.5;
//   ctx.scale(scale, scale);
//   console.log(scale);
// }

// function lessScale() {
//   console.log("lessScale");
//   scale -= 0.5;
//   ctx.scale(scale, scale);
//   console.log(scale);
// }

// var myGridObject = {
//   canvasWidth: 400, //ширина холста
//   canvasHeight: 400, //высота холста
//   cellsNumberX: 20, //количество ячеек по горизонтали
//   cellsNumberY: 20, //количество ячеек по вертикали
//   color: "#00f", //цвет линий
//   //Метод setSettings устанавливает все настройки
//   setSettings: function () {
//     // получаем наш холст по id
//     canvas = document.getElementById("example");
//     // устанавливаем ширину холста
//     //canvas.width = window.outerWidth;
//     canvas.width = this.canvasWidth;
//     // устанавливаем высоту холста
//     //canvas.height = window.outerHeight;
//     canvas.height = this.canvasHeight;
//     // canvas.getContext("2d") создает объект для рисования
//     ctx = canvas.getContext("2d");
//     // задаём цвет линий
//     ctx.strokeStyle = this.color;
//     // вычисляем ширину ячейки по горизонтали
//     lineX = canvas.width / this.cellsNumberX;
//     // вычисляем высоту ячейки по вертикали
//     lineY = canvas.height / this.cellsNumberY;
//   },
//   // данная функция как раз и будет отрисовывать сетку
//   drawGrid: function () {
//     // в переменной buf будет храниться начальная координата, откуда нужно рисовать линию
//     // с каждой итерацией она должна увеличиваться либо на ширину ячейки, либо на высоту
//     var buf = 0;
//     // Рисуем вертикальные линии
//     for (var i = 0; i <= this.cellsNumberX; i++) {
//       // начинаем рисовать
//       ctx.beginPath();
//       // ставим начальную точку
//       ctx.moveTo(buf, 0);
//       // указываем конечную точку для линии
//       ctx.lineTo(buf, canvas.height);
//       // рисуем и выводим линию
//       ctx.stroke();
//       buf += lineX;
//     }
//     buf = 0;
//     // Рисуем горизонтальные линии
//     for (var j = 0; j <= this.cellsNumberY; j++) {
//       ctx.beginPath();
//       ctx.moveTo(0, buf);
//       ctx.lineTo(canvas.width, buf);
//       ctx.stroke();
//       buf += lineY;
//     }
//   },
// };

// myGridObject.setSettings();
// myGridObject.drawGrid();
