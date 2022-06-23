// consts.
const WIDTH = 600;
const HEIGHT = 600;

// elms.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = document.getElementById('img');
const btn = document.getElementById('upload');
const icon = document.getElementById('icon');

// variables.
let isDrag = false;
let isExistImage = false;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let currentImage = null;

/**
 * init.
 */
function _init() {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
}

/**
 * for mouse down event.
 */
function _down(e) {
  startX = e.offsetX;
  startY = e.offsetY;
  endX = 0;
  endY = 0;
  isDrag = true;
}

/**
 * for mouse move event.
 */
function _move(e) {
  if(isDrag) {
    if (isExistImage) {
      drawLineOnImage(e.offsetX, e.offsetY);
    } else {
      clearCanvas();
      drawLine(e.offsetX, e.offsetY);
    }
  }
}

/**
 * for mouse up event.
 */
function _up(e) {
  endX = e.offsetX;
  endY = e.offsetY;
  isDrag = false;
  if (confirm('Already Done??\nYes->OK | No->Cancel')) {
    annotateImage(startX, startY, endX, endY);
  } else {
    clearCanvas();
  }
}

/**
 * draw line at canvas.
 */
function drawLine(x,y) {
  // start -> x.
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(x,startY);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  ctx.stroke();

  // start -> y.
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX,y);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  ctx.stroke();

  // x -> current end.
  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.lineTo(x,y);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  ctx.stroke();

  // y -> end.
  ctx.beginPath();
  ctx.moveTo(x, startY);
  ctx.lineTo(x,y);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  ctx.stroke();
}

/**
 * draw line at canvas with image.
 */
function drawLineOnImage(x,y) {
  if (currentImage && currentImage !== null) {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // draw.
        drawLine(x,y);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(currentImage);
  } else {
    currentImage = null;
    isExistImage = false;
    alert('image is not found.');
  }
}

/**
 * all clear canvas.
 */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * donwload canvas data as png file.
 */
function downloadCanvasAsImage() {
  let link = document.createElement('a');
  link.href = canvas.toDataURL("image/png");
  link.download = "annotated.png";
  link.click();
}

/**
 * upload image to canvas.
 */
function uploadImage() {
  const f = img.files[0];
  if (f) {
    currentImage = f;
    const img = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(f);
    isExistImage = true;
  } else {
    currentImage = null;
    isExistImage = false;
    alert('file is not found.')
  }
}

/**
 * fill area and put icon.
 */
function annotateImage(sx, sy, ex, ey) {
  const area = getArea(sx, sy, ex, ey);
  fillArea(area);
  putIconArea(sx, sy, ex, ey);

  // download layer canvas.
  if (confirm('Download?')) {
    downloadCanvasAsImage();
  }
}

/**
 * get area from selected points.
 */
function getArea(sx, sy, ex, ey) {
  let area = new Path2D();
  area.moveTo(sx, sy);
  area.lineTo(sx,ey);
  area.lineTo(ex,ey);
  area.lineTo(ex,sy);
  area.closePath();
  return area;
}

/**
 * fill selected area.
 */
function fillArea(area) {
  ctx.fillStyle = 'green';
  ctx.fill(area, 'evenodd');
}

/**
 * put icon at center of selected area.
 */
function putIconArea(sx, sy, ex, ey) {
  const x = (sx + ex) / 2;
  const y = (sy + ey) / 2;

  // const icon = document.createElement('canvas');
  // const iconCtx = icon.getContext('2d');
  // iconCtx.fillStyle = 'yellow';
  // iconCtx.fillRect(0,0,64,32);
  // ctx.drawImage(icon, x,y,32,32);

  const iconImg = new Image();
  iconImg.src = icon.src;
  iconImg.width = 16;
  iconImg.height = 16;

  ctx.drawImage(iconImg, x,y);
}

// event binds.
canvas.onmousedown = _down;
canvas.onmousemove = _move;
canvas.onmouseup = _up;
btn.onclick = uploadImage;

_init();
