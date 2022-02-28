const imageForm = document.getElementById("image");
const detailArea = document.getElementById("detail");
const previewBoard = document.getElementById("preview");
const previewContext = previewBoard.getContext("2d");
var offsetX = null;
var offsetY = null;
var imageData = null;

// events.
imageForm.onchange = getDetail;
previewBoard.onmousemove = getCurrentInfo;

/**
 * on change event.
 */
function getDetail(e) {
  const file = e.target.files[0];
  showPreview(file);
  showDetail(file);
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
  if (imageData !== null) {
    let mouseX = parseInt(e.clientX - offsetX);
    let mouseY = parseInt(e.clientY - offsetY);
    console.log(`x : ${mouseX}, y : ${mouseY}`);
    console.log(imageData);
  }
}
