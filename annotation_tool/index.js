// elm.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = document.getElementById('img');
const btn = document.getElementById('upload');

// variables.
let isDrag = false;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;


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
    // TODO 画像ありで線を書く時にキャンバスをクリアすることでおかしくなる。
    clearCanvas();
    drawLine(e.offsetX, e.offsetY);
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
    // annotateImage(startX, startY, endX, endY);
    downloadCanvasAsImage();
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
    const img = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        // TODO ここで変更するとoffsetの値が狂う
        ctx.drawImage(img, 0, 0);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(f);
  } else {
    alert('file is not found.')
  }
}

/**
 * TODO 未実装。画像の埋め込みをしたい
 */
function annotateImage(sx, sy, ex, ey) {
  console.log(sx);
  console.log(sy);
  console.log(ex);
  console.log(ey);
}

// event binds.
canvas.onmousedown = _down;
canvas.onmousemove = _move;
canvas.onmouseup = _up;
btn.onclick = uploadImage;
