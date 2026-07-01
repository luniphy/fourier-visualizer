function setupCanvas(canvas) {
  dpr = window.devicePixelRatio || 1;
  cssWidth = canvas.clientWidth;
  cssHeight = canvas.clientHeight;

  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return ctx;
}

function setupAxes(canvas, ctx) {
  w = canvas.clientWidth;
  h = canvas.clientHeight;

  centerX = w / 2;
  centerY = h / 2;

  tickSize = 3;
  step = 20;

  ctx.strokeStyle = "white";

  // x-axis
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(w, centerY);
  ctx.stroke();

  // y-axis
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, h);
  ctx.stroke();

  // x steps
  for (let x = step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, centerY - tickSize);
    ctx.lineTo(x, centerY + tickSize);
    ctx.stroke();
  }

  // y steps
  for (let y = step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(centerX - tickSize, y);
    ctx.lineTo(centerX + tickSize, y);
    ctx.stroke();
  }
}

inputCanvas = document.getElementById("inputCanvas");
fourierCanvas = document.getElementById("fourierCanvas");

inputCtx = setupCanvas(inputCanvas);
fourierCtx = setupCanvas(fourierCanvas);

setupAxes(inputCanvas, inputCtx);
setupAxes(fourierCanvas, fourierCtx);
