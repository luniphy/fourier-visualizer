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

function setupAxes(canvas, ctx, steps) {
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

  step = w / steps

  // ticks
  ctx.beginPath();
  // +/- x
  for (let x = 0; x < w; x += step) {
    ctx.moveTo(x , h / 2 + coordinateLineLength);
    ctx.lineTo(x , h / 2 - coordinateLineLength);
  }
  // -y
  for (let y = h / 2; y < h; y += step) {
    ctx.moveTo(w / 2 + coordinateLineLength, y);
    ctx.lineTo(w / 2 - coordinateLineLength, y);
  }
  // +y
  for (let y = h / 2; y >= 0; y -= step) {
    ctx.moveTo(w / 2 + coordinateLineLength, y);
    ctx.lineTo(w / 2 - coordinateLineLength, y);
  }
  ctx.stroke();
}

function func(canvas, ctx, steps, A, f, phi, O) {
  ctx.strokeStyle = "white";

  w = canvas.clientWidth;
  h = canvas.clientHeight;

  step = w / steps

  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    xCorr = x - w / 2;
    fCorr = f / step;
    ACorr = A * step;
    OCorr = O * step;
    
    y = h / 2 - Math.sin((xCorr * fCorr) - phi) * ACorr - OCorr;

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function redraw() {
  A = parseFloat(document.querySelector(".amplitude-slider").value);
  f = parseFloat(document.querySelector(".frequency-slider").value);
  phi = parseFloat(document.querySelector(".phase-slider").value);
  O = parseFloat(document.querySelector(".offset-slider").value);

  document.getElementById("ampVal").textContent = A;
  document.getElementById("freqVal").textContent = f;
  document.getElementById("phaseVal").textContent = phi;
  document.getElementById("offsetVal").textContent = O;

  phi = phi * Math.PI / 180;

  inputCtx.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
  setupAxes(inputCanvas, inputCtx, stepCount);
  func(inputCanvas, inputCtx, steps=stepCount, A, f, phi, O);
}



inputCanvas = document.getElementById("inputCanvas");
fourierCanvas = document.getElementById("fourierCanvas");

inputCtx = setupCanvas(inputCanvas);
fourierCtx = setupCanvas(fourierCanvas);

stepCount = 30;

setupAxes(inputCanvas, inputCtx, steps=stepCount);
setupAxes(fourierCanvas, fourierCtx, steps=stepCount);

redraw();

document.querySelector(".amplitude-slider").oninput = redraw;
document.querySelector(".frequency-slider").oninput = redraw;
document.querySelector(".phase-slider").oninput = redraw;
document.querySelector(".offset-slider").oninput = redraw;

// TODO: Adjust Intro text
