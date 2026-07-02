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
  coordinateLineLength = 3;
  ctx.strokeStyle = "white";

  w = canvas.clientWidth;
  h = canvas.clientHeight;

  // x-axis
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // y-axis
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();

  steps = 15;
  step = w / 2 / steps;

  // x steps
  ctx.beginPath();
  for (let i = 0; i < w / 2; i += step) {
    // +x
    ctx.moveTo(w / 2 + i, h / 2 - coordinateLineLength);
    ctx.lineTo(w / 2 + i, h / 2 + coordinateLineLength);
    // -x
    ctx.moveTo(w / 2 - i, h / 2 - coordinateLineLength);
    ctx.lineTo(w / 2 - i, h / 2 + coordinateLineLength);
    // +y
    ctx.moveTo(w / 2 - coordinateLineLength, h / 2 + i);
    ctx.lineTo(w / 2 + coordinateLineLength, h / 2 + i);
    // -y
    ctx.moveTo(w / 2 - coordinateLineLength, h / 2 - i);
    ctx.lineTo(w / 2 + coordinateLineLength, h / 2 - i);
  }
  ctx.stroke();
}

function func(canvas, ctx, A, f, phi, O) {
  ctx.strokeStyle = "white";

  w = canvas.clientWidth;
  h = canvas.clientHeight;

  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    y = h / 2 - Math.sin(x * 0.05 * f - phi) * (h / 4) * A + O;

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

inputCanvas = document.getElementById("inputCanvas");
fourierCanvas = document.getElementById("fourierCanvas");

inputCtx = setupCanvas(inputCanvas);
fourierCtx = setupCanvas(fourierCanvas);

setupAxes(inputCanvas, inputCtx);
setupAxes(fourierCanvas, fourierCtx);

func(inputCanvas, inputCtx, 1, 1, 0, 0);
func(fourierCanvas, fourierCtx, 1, 1, 0, 0);

// TODO: Adjust Intro text
