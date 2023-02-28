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
