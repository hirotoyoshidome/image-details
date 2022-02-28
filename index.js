const imageForm = document.getElementById("image");
const detailArea = document.getElementById("detail");
const previewBoard = document.getElementById("preview");
const previewContext = previewBoard.getContext("2d");

imageForm.onchange = getDetail;

/**
 * on change event.
 */
function getDetail(e) {
  const file = e.target.files[0];
  showDetail(file);
  showPreview(file);
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
