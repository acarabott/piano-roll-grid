/* global Point, Rectangle, Layer, LayerManager */
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
const layerManager = new LayerManager();
const controls = document.createElement('div');
controls.id = 'controls';
document.body.appendChild(controls);
let snapping = true;
const NUM_KEYS = 20;

const keyRect = new Rectangle(0, 0, canvas.width * 0.075, canvas.height);
const patternRect = new Rectangle(keyRect.br.x,
                                  keyRect.y,
                                  canvas.width - keyRect.width,
                                  keyRect.height);



function loop(n, func) {
  for (let i = 0; i < n; i++) {
    func(i);
  }
}

function constrain(val, min=0, max=1.0) {
  return Math.min(Math.min(val, max), min);
}

function renderPiano(ctx, drawRect, numKeys, alpha = 1.0) {
  const colors = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w'];
  const keyHeight = drawRect.height / numKeys;

  loop(numKeys, i => {
    ctx.fillStyle = colors[i % colors.length] === 'w'
      ? `rgba(255, 255, 255, ${alpha}`
      : `rgba(0, 0, 0, ${alpha}`;
    const y = drawRect.y + ((numKeys - (i + 1)) * keyHeight);
    ctx.fillRect(drawRect.x, y, drawRect.width, keyHeight);
    ctx.strokeStyle = `rgba(100, 100, 100, ${alpha})`;
    ctx.strokeRect(drawRect.x, y, drawRect.width, keyHeight);
  });
}

function update() {
  if (layerManager.layersChanged) {
    const layerList = layerManager.list;
    controls.appendChild(layerList);
    layerManager.layersChanged = false;
  }
}

function render() {
  ctx.save();
  ctx.fillStyle = 'rgb(200, 200, 200)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderPiano(ctx, keyRect, NUM_KEYS);
  renderPiano(ctx, patternRect, NUM_KEYS, 0.2);

  layerManager.layers.forEach(layer => layer.render(ctx));

  if (layerManager.selection.active) {
    ctx.strokeStyle = '#000';
    ctx.strokeRect(...layerManager.selection.rect);
  }
  ctx.restore();
}


function mainLoop() {
  update();
  render();
  requestAnimationFrame(mainLoop);
}

function getSnappedPoint(point, containerRect, vertDivision) {
  const x = point.x;
  const vertStep = containerRect.height / vertDivision;
  const distanceToStepAbove = point.y % vertStep;
  const y = point.y - distanceToStepAbove + (distanceToStepAbove > (vertStep / 2)
                                              ? vertStep
                                              : 0);

  return new Point(x, y);
}

canvas.addEventListener('mousedown', event => {
  layerManager.selection.active = true;
  let point = new Point(event.offsetX, event.offsetY);
  if (snapping) { point = getSnappedPoint(point, patternRect, NUM_KEYS); }
  layerManager.selection.rect.tl = point;
  layerManager.selection.rect.br = point;
});

document.body.addEventListener('mouseup', event => {
  layerManager.selection.active = false;

  if (event.srcElement === canvas) {
    layerManager.addLayer(...layerManager.selection.rect, 3);
  }
});

canvas.addEventListener('mousemove', event => {
  if (layerManager.selection.active) {
    let point = new Point(event.offsetX, event.offsetY);
    if (snapping) { point = getSnappedPoint(point, patternRect, NUM_KEYS); }
    layerManager.selection.rect.br = point;
  }
});

document.addEventListener('DOMContentLoaded', mainLoop);
