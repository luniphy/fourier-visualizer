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
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  ctx.strokeStyle = "white";
  ctx.beginPath();

  // x-axis
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);

  // y-axis
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);

  const tickLength = 3;
  const step = w / steps;

  // +/- x ticks
  for (let x = 0; x < w; x += step) {
    ctx.moveTo(x, h / 2 + tickLength);
    ctx.lineTo(x, h / 2 - tickLength);
  }
  // -y ticks
  for (let y = h / 2; y < h; y += step) {
    ctx.moveTo(w / 2 + tickLength, y);
    ctx.lineTo(w / 2 - tickLength, y);
  }
  // +y ticks
  for (let y = h / 2; y >= 0; y -= step) {
    ctx.moveTo(w / 2 + tickLength, y);
    ctx.lineTo(w / 2 - tickLength, y);
  }

  ctx.stroke();
}



function rectangular(x, A, f, phi, O) {
  const waveVal = Math.sin(x * f - phi) >= 0 ? 1 : -1;
  return waveVal * A + O;
}
function sawtooth(x, A, f, phi, O) {
  const waveVal = ((((x * f - phi) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / Math.PI - 1;
  return waveVal * A + O;
}
function triangular(x, A, f, phi, O) {
  const waveVal = (2 / Math.PI) * Math.asin(Math.sin(x * f - phi));
  return waveVal * A + O;
}
function sine(x, A, f, phi, O) {
  const waveVal = Math.sin(x * f - phi);
  return waveVal * A + O;
}



function RK4(fct, y) {
  const h = 0.01; // step size

  k0 = fct(y);
  k1 = fct(y + (h / 2) * k0);
  k2 = fct(y + (h / 2) * k1);
  k3 = fct(y + h * k2);

  return y + (h / 6) * (k0 + 2 * k1 + 2 * k2 + k3);
}
function a0Coefficient(a0_old, fct) {
  fct = (1 / Math.PI) * fct;
  return RK4(fct, a0_old);
}
function anCoefficient(an_old, fct, n, x) {
  fct = (1 / Math.PI) * fct * Math.cos(n * x);
  return RK4(fct, an_old);
}
function bnCoefficient(bn_old, fct, n, x) {
  fct = (1 / Math.PI) * fct * Math.sin(n * x);
  return RK4(fct, bn_old);
}



function drawInputWave(canvas, ctx, steps, fctSelect, A, f, phi, O) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  const step = w / steps;

  const fScaled = f / step;
  const AScaled = A * step;
  const OScaled = O * step;

  const waveFunctions = { rectangular, sawtooth, triangular, sine };
  const fct = waveFunctions[fctSelect];

  ctx.strokeStyle = "white";
  ctx.beginPath();

  for (let x = 0; x < w; x++) {
    const xCentered = x - w / 2;
    const waveVal = fct(xCentered, AScaled, fScaled, phi, OScaled);

    const y = h / 2 - waveVal;

    if (x == 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}
function drawFourierWave(canvas, ctx, steps, fctSelect, A, f, phi, O, n) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  const step = w / steps;

  const fScaled = f / step;
  const AScaled = A * step;
  const OScaled = O * step;

  const waveFunctions = { rectangular, sawtooth, triangular, sine };
  const fct = waveFunctions[fctSelect];

  a0 = 0;
  an = 0;
  bn = 0;

  ctx.strokeStyle = "orange";
  ctx.beginPath();

  for (let x = 0; x < w; x++) {
    const xCentered = x - w / 2;
    const waveVal = fct(xCentered, AScaled, fScaled, phi, OScaled);

    a0 = a0Coefficient(a0, fct, xCentered, AScaled, fScaled, phi, OScaled);

    sum = a0 / 2;

    for (let i = 1; i <= n; i++) {
      an = anCoefficient(an, fct, i, xCentered, AScaled, fScaled, phi, OScaled);
      bn = bnCoefficient(bn, fct, i, xCentered, AScaled, fScaled, phi, OScaled);
      sum += an * Math.cos(n * x) + bn * Math.sin(n * x)
    }

    const y = h / 2 - sum;

    if (x == 0) {
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
  phi = parseInt(document.querySelector(".phase-slider").value);
  O = parseFloat(document.querySelector(".offset-slider").value);
  n = parseInt(document.querySelector(".modes-slider").value);

  document.getElementById("ampVal").textContent = A;
  document.getElementById("freqVal").textContent = f;
  document.getElementById("phaseVal").textContent = phi;
  document.getElementById("offsetVal").textContent = O;
  document.getElementById("modesVal").textContent = n;

  mathCtx.clearRect(0, 0, mathCanvas.width, mathCanvas.height);
  setupAxes(mathCanvas, mathCtx, stepCount);

  fctSelect = document.querySelector(".fct-select").value;
  phi = (phi * Math.PI) / 180;
  drawInputWave(mathCanvas, mathCtx, (steps = stepCount), fctSelect, A, f, phi, O);
  drawFourierWave(mathCanvas, mathCtx, (steps = stepCount), fctSelect, A, f, phi, O, n);
}



stepCount = 20;

mathCanvas = document.getElementById("mathCanvas");
mathCtx = setupCanvas(mathCanvas);
setupAxes(mathCanvas, mathCtx, (steps = stepCount));

redraw();

document.querySelector(".fct-select").addEventListener("change", redraw);

document.querySelector(".amplitude-slider").oninput = redraw;
document.querySelector(".frequency-slider").oninput = redraw;
document.querySelector(".phase-slider").oninput = redraw;
document.querySelector(".offset-slider").oninput = redraw;
document.querySelector(".modes-slider").oninput = redraw;

// TODO: Adjust Intro text
// TODO: CheckBox for input fct in fourierCanvas
// w = 2 * pi * f
