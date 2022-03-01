// const screenWidth = window.screen.width;
// const screenHeight = window.screen.height;
const init = document.getElementById("init");
const imageForm = document.getElementById("image");
const detailArea = document.getElementById("detail");
const previewBoard = document.getElementById("preview");
const previewContext = previewBoard.getContext("2d");
const alpha = document.getElementById("alpha");
const rotateButton = document.getElementById("rotate");
var offsetX = null;
var offsetY = null;
var imageData = null;
const COLORS = ["R", "G", "B", "A"];
var isShow = false;

let imgRaw = null;

// events.
imageForm.onchange = getDetail;
previewBoard.onmousemove = getCurrentInfo;
alpha.onchange = changeAlpha;
rotateButton.onclick = changeRotate;

/**
 * on change event.(init)
 */
function getDetail(e) {
  const file = e.target.files[0];
  showPreview(file);
  showDetail(file);
  init.style.display = "none";
}

/**
 * show image detail.
 */
function showDetail(f) {
  const fileNmae = f.name;
  createPTag("FILE NAME", fileNmae);
  const fileSize = f.size;
  createPTag("FILE SIZE", fileSize);
  const filetype = f.type;
  createPTag("FILE TYPE", filetype);
}

/**
 * show image preview.
 */
function showPreview(f) {
  const img = new Image();
  const reader = new FileReader();
  reader.onload = function (e) {
    img.onload = function () {
      previewBoard.width = img.width;
      previewBoard.height = img.height;
      imgRaw = img;
      previewContext.drawImage(img, 0, 0);
      // image info.
      createPTag("IMAGE WIDTH", img.width);
      createPTag("IMAGE HEIGHT", img.height);
      // get offset.
      const BB = previewBoard.getBoundingClientRect();
      offsetX = BB.left;
      offsetY = BB.top;
      // get image data.
      imageData = getImageArray();
      // add RGBA area.
      createRGBA();
      isShow = true;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(f);
}

/**
 * create p tag and insert detail area.
 */
function createPTag(label, text) {
  const pTag = document.createElement("p");
  pTag.textContent = `${label}: ${text}`;
  detailArea.append(pTag);
}

/**
 * create rgba area.
 */
function createRGBA() {
  for (let c of COLORS) {
    const pTag = document.createElement("p");
    pTag.innerHTML = `${c}: <span id="${c}"></span>`;
    detailArea.append(pTag);
  }
}

/**
 * get image as array.
 */
function getImageArray() {
  const data = previewContext.getImageData(
    0,
    0,
    previewBoard.width,
    previewBoard.height
  ).data;
  const imageArray = [];
  for (let i = 0; i < data.length; i += 4) {
    imageArray.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      a: data[i + 3],
    });
  }
  return imageArray;
}

/**
 * get current info.
 */
function getCurrentInfo(e) {
  e.preventDefault();
  if (isShow) {
    const data = previewContext.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    document.getElementById("R").textContent = data[0];
    document.getElementById("G").textContent = data[1];
    document.getElementById("B").textContent = data[2];
    document.getElementById("A").textContent = data[3];
  }

  // if (imageData !== null) {
  //   let mouseX = parseInt(e.clientX - offsetX);
  //   let mouseY = parseInt(e.clientY - offsetY);
  //   console.log(`x : ${mouseX}, y : ${mouseY}`);
  //   console.log(imageData);
  // }
}

/**
 * change alpha.
 */
function changeAlpha() {
  clearCanvas();
  const alp = this.value / 100;
  previewContext.globalAlpha = alp;
  reloadCanvas();
}

/**
 * change rotate.
 */
function changeRotate() {
  clearCanvas();
  previewContext.translate(previewBoard.width / 2, previewBoard.height / 2);
  previewContext.rotate((90 * Math.PI) / 180);
  previewContext.translate(
    (-1 * previewBoard.width) / 2,
    (-1 * previewBoard.height) / 2
  );
  reloadCanvas();
}

/**
 * clear.
 */
function clearCanvas() {
  previewContext.clearRect(0, 0, previewBoard.width, previewBoard.height);
}

/**
 * reload.
 */
function reloadCanvas() {
  if (imgRaw !== null) {
    previewContext.drawImage(imgRaw, 0, 0);
  }
}
