function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth;
  const cssHeight = canvas.clientHeight;

  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return ctx;
}
function setupAxes(ctx) {
  ctx.strokeStyle = "white";
  ctx.beginPath();

  // x-axis
  ctx.moveTo(0, canvasHeight / 2);
  ctx.lineTo(canvasWidth, canvasHeight / 2);

  // y-axis
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);

  const tickLength = 3;

  // +/- x ticks
  for (let x = 0; x < canvasWidth; x += OneTick) {
    ctx.moveTo(x, canvasHeight / 2 + tickLength);
    ctx.lineTo(x, canvasHeight / 2 - tickLength);
  }
  // -y ticks
  for (let y = canvasHeight / 2; y < canvasHeight; y += OneTick) {
    ctx.moveTo(canvasWidth / 2 + tickLength, y);
    ctx.lineTo(canvasWidth / 2 - tickLength, y);
  }
  // +y ticks
  for (let y = canvasHeight / 2; y >= 0; y -= OneTick) {
    ctx.moveTo(canvasWidth / 2 + tickLength, y);
    ctx.lineTo(canvasWidth / 2 - tickLength, y);
  }

  ctx.stroke();
}



function rectangular(x, A, f, phi, O) {
  const waveVal = Math.sin(x * f - phi) >= 0 ? 1 : -1;
  return waveVal * A + O;
}
function sawtooth(x, A, f, phi, O) {
  const t = x * f - phi;
  const waveVal = t / Math.PI - 2 * Math.floor(t / (2 * Math.PI)) - 1;
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
const waveFunctions = { rectangular, sawtooth, triangular, sine };



function simpsonsRule(fct, start, end) {
  const integrationSteps = 1000;
  const h = (end - start) / integrationSteps; // step size

  let sum = 0;

  for (let i = 0; i < integrationSteps; i++) {
    const x = start + h * i;

    const a = fct(x);
    const m = fct(x + h / 2);
    const b = fct(x + h);

    sum += (h / 6) * (a + 4 * m + b);
  }
  return sum;
}
function an(fct, A, f, phi, O, n) {
  return function (x) {
    return (1 / Math.PI) * fct(x, A, f, phi, O) * Math.cos(n * x);
  };
}
function bn(fct, A, f, phi, O, n) {
  return function (x) {
    return (1 / Math.PI) * fct(x, A, f, phi, O) * Math.sin(n * x);
  };
}



function drawInputWave(ctx, fct, A, f, phi, O) {
  ctx.strokeStyle = "white";
  ctx.beginPath();

  for (let x = 0; x < canvasWidth; x++) {
    const xCentered = x - canvasWidth / 2;
    const t = (xCentered * (2 * Math.PI)) / canvasWidth; // Conversion

    const y = canvasHeight / 2 - fct(t, A, f, phi, O);

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}
function drawFourierWave(ctx, fct, A, f, phi, O, n) {
  const a = [];
  const b = [];

  for (let i = 0; i <= n; i++) {
    a.push(simpsonsRule(an(fct, A, f, phi, O, i), -Math.PI, Math.PI));
    b.push(simpsonsRule(bn(fct, A, f, phi, O, i), -Math.PI, Math.PI));
  }

  ctx.strokeStyle = "orange";
  ctx.beginPath();

  for (let x = 0; x < canvasWidth; x++) {
    const xCentered = x - canvasWidth / 2;
    const t = (xCentered * (2 * Math.PI)) / canvasWidth; // Conversion

    let sum = a[0] / 2;
    for (let i = 1; i <= n; i++) {
      sum += a[i] * Math.cos(i * t) + b[i] * Math.sin(i * t);
    }

    const y = canvasHeight / 2 - sum;

    if (x === 0) {
      ctx.moveTo(x, y);
    }
    else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}



function redraw() {
  const A = parseFloat(ampSlider.value);
  const f = parseFloat(freqSlider.value);
  const phiDeg = parseInt(phaseSlider.value, 10);
  const O = parseFloat(offsetSlider.value);
  const n = parseInt(modesSlider.value, 10);

  ampSpan.textContent = A;
  freqSpan.textContent = f;
  phaseSpan.textContent = phiDeg;
  offsetSpan.textContent = O;
  modesSpan.textContent = n;

  const selectedFct = fctSelect.value;

  const inputCheckBool = inputCheckbox.checked;
  const fourierCheckBool = fourierCheckbox.checked;


  mathCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  setupAxes(mathCtx);


  const fct = waveFunctions[selectedFct];

  const AScaled = A * OneTick;
  const fScaled = f * tickCount / (2 * Math.PI);
  const phiRad = (phiDeg * Math.PI) / 180;
  const OScaled = O * OneTick;


  if (inputCheckBool) {
    drawInputWave(mathCtx, fct, AScaled, fScaled, phiRad, OScaled);
  }
  if (fourierCheckBool) {
    drawFourierWave(mathCtx, fct, AScaled, fScaled, phiRad, OScaled, n);
  }
}



// Caching nodes
const ampSlider = document.getElementById("amplitude-slider");
const freqSlider = document.getElementById("frequency-slider");
const phaseSlider = document.getElementById("phase-slider");
const offsetSlider = document.getElementById("offset-slider");
const modesSlider = document.getElementById("modes-slider");

const ampSpan = document.getElementById("amp-val");
const freqSpan = document.getElementById("freq-val");
const phaseSpan = document.getElementById("phase-val");
const offsetSpan = document.getElementById("offset-val");
const modesSpan = document.getElementById("modes-val"); 

const fctSelect = document.getElementById("fct-select");

const inputCheckbox = document.getElementById("input-checkbox");
const fourierCheckbox = document.getElementById("fourier-checkbox");


// Canvas
const mathCanvas = document.getElementById("math-canvas");
const mathCtx = setupCanvas(mathCanvas);

const canvasWidth = mathCanvas.clientWidth;
const canvasHeight = mathCanvas.clientHeight;

const tickCount = 20;
const OneTick = canvasWidth / tickCount;


redraw();


// Event handlers
ampSlider.oninput = redraw;
freqSlider.oninput = redraw;
phaseSlider.oninput = redraw;
offsetSlider.oninput = redraw;
modesSlider.oninput = redraw;

fctSelect.addEventListener("change", redraw);

inputCheckbox.addEventListener("change", redraw);
fourierCheckbox.addEventListener("change", redraw);
