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
function setupAxes(canvas, ctx, ticks) {
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
  const tick = w / ticks;

  // +/- x ticks
  for (let x = 0; x < w; x += tick) {
    ctx.moveTo(x, h / 2 + tickLength);
    ctx.lineTo(x, h / 2 - tickLength);
  }
  // -y ticks
  for (let y = h / 2; y < h; y += tick) {
    ctx.moveTo(w / 2 + tickLength, y);
    ctx.lineTo(w / 2 - tickLength, y);
  }
  // +y ticks
  for (let y = h / 2; y >= 0; y -= tick) {
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



function RK4(fct, start, end, steps) {
  const h = (end - start) / steps; // step size

  let sum = 0;

  for (let i = 0; i < steps; i++) {
    x = start + h * i;

    k0 = fct(x);
    k1 = fct(x + h / 2);
    k2 = fct(x + h / 2);
    k3 = fct(x + h);

    sum += (h / 6) * (k0 + 2 * k1 + 2 * k2 + k3);
  }
  return sum;
}
function an(fct, A, f, phi, O, n, w) {
  return function (t) {
    const xPixel = (t * w) / (2 * Math.PI);
    return (1 / Math.PI) * fct(xPixel, A, f, phi, O) * Math.cos(n * t);
  };
}
function bn(fct, A, f, phi, O, n, w) {
  return function (t) {
    const xPixel = (t * w) / (2 * Math.PI);
    return (1 / Math.PI) * fct(xPixel, A, f, phi, O) * Math.sin(n * t);
  };
}



function drawInputWave(canvas, ctx, ticks, fctSelect, A, f, phi, O) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  const tick = w / ticks;

  const fScaled = f / tick;
  const AScaled = A * tick;
  const OScaled = O * tick;

  const waveFunctions = { rectangular, sawtooth, triangular, sine };
  const fct = waveFunctions[fctSelect];

  ctx.strokeStyle = "white";
  ctx.beginPath();

  for (let x = 0; x < w; x++) {
    const xCentered = x - w / 2;

    const y = h / 2 - fct(xCentered, AScaled, fScaled, phi, OScaled);

    if (x == 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}
function drawFourierWave(canvas, ctx, ticks, fctSelect, A, f, phi, O, n) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  const tick = w / ticks;

  const fScaled = f / tick;
  const AScaled = A * tick;
  const OScaled = O * tick;

  const waveFunctions = { rectangular, sawtooth, triangular, sine };
  const fct = waveFunctions[fctSelect];

  let a = [];
  let b = [];

  for (let i = 0; i <= n; i++) {
    a.push(RK4(an(fct, AScaled, fScaled, phi, OScaled, i, w), -Math.PI, Math.PI, 1000));
    b.push(RK4(bn(fct, AScaled, fScaled, phi, OScaled, i, w), -Math.PI, Math.PI, 1000));
  }

  ctx.strokeStyle = "orange";
  ctx.beginPath();

  for (let x = 0; x < w; x++) {
    const xCentered = x - w / 2;
    const tCentered = (xCentered * (2 * Math.PI)) / w;

    sum = a[0] / 2;
    for (let i = 1; i <= n; i++) {
      sum += a[i] * Math.cos(i * tCentered) + b[i] * Math.sin(i * tCentered);
    }

    const y = h / 2 - sum;

    if (x == 0) {
      ctx.moveTo(x, y);
    }
    else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}



function redraw() {
  A = parseFloat(document.getElementById("amplitude-slider").value);
  f = parseFloat(document.getElementById("frequency-slider").value);
  phi = parseInt(document.getElementById("phase-slider").value);
  O = parseFloat(document.getElementById("offset-slider").value);
  n = parseInt(document.getElementById("modes-slider").value);

  document.getElementById("amp-val").textContent = A;
  document.getElementById("freq-val").textContent = f;
  document.getElementById("phase-val").textContent = phi;
  document.getElementById("offset-val").textContent = O;
  document.getElementById("modes-val").textContent = n;

  fctSelect = document.getElementById("fct-select").value;

  inputCheck = document.getElementById("input-checkbox").checked;
  fourierCheck = document.getElementById("fourier-checkbox").checked;


  mathCtx.clearRect(0, 0, mathCanvas.width, mathCanvas.height);
  setupAxes(mathCanvas, mathCtx, tickCount);

  phi = (phi * Math.PI) / 180;


  if (inputCheck) {
    drawInputWave(mathCanvas, mathCtx, tickCount, fctSelect, A, f, phi, O);
  }
  if (fourierCheck) {
    drawFourierWave(mathCanvas, mathCtx, tickCount, fctSelect, A, f, phi, O, n);
  }
}



tickCount = 20;

mathCanvas = document.getElementById("math-canvas");
mathCtx = setupCanvas(mathCanvas);
setupAxes(mathCanvas, mathCtx, (ticks = tickCount));

redraw();


document.getElementById("fct-select").addEventListener("change", redraw);

document.getElementById("amplitude-slider").oninput = redraw;
document.getElementById("frequency-slider").oninput = redraw;
document.getElementById("phase-slider").oninput = redraw;
document.getElementById("offset-slider").oninput = redraw;
document.getElementById("modes-slider").oninput = redraw;


document.getElementById("input-checkbox").addEventListener("change", redraw);
document.getElementById("fourier-checkbox").addEventListener("change", redraw);
