
export const convertFile2Image = async (file) => {
  console.log("[convertFile2Image] file:", file);
  return await new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      console.log("文件转IMG对象 onload:", e.target.result);
    };
    reader.onerror = function (e) {
      console.info("onerror e:", e);
      reject(e);
    };
    reader.readAsDataURL(file);
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function (e) {
      console.log("img onerror:", e);
      reject(e);
    };
  });
};
export const DEFULT_IMG_CONFIG = {
  width: 918,
  height: 1188,
  quality: 0.85,
};
export const base64HeaderExp = /^data:image\/\w+;base64,/;
export const BASE64_HEADER = "data:image/jpeg;base64,";
export const convertBase2Image = async (base64) => {
  // 判断没有base64头就加上
  if (!base64HeaderExp.test(base64)) {
    base64 = BASE64_HEADER + base64;
  }
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      console.log("e", e);
      reject(e);
    };
  });
};
export const compressImage = async (
  input,
  outputType = "image/jpeg",
  config = DEFULT_IMG_CONFIG
) => {
  let img;
  console.log("图片压缩处理开始");
  if (Object.prototype.toString.call(input) === "[object HTMLImageElement]") {
    console.log("输入为Image");
    img = input;
  } else if (typeof input === "string") {
    // 输入为base64
    console.log("输入为base64");
    img = await convertBase2Image(input);
  } else {
    img = new Image();
  }

  const { width: inputWidth, height: inputHeight } = img;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  // 尺寸限制
  const { width, height, quality } = config;
  console.log(`图片尺寸限制${width}*${height}`);
  // 目标尺寸
  let targetWidth = inputWidth;
  let targetHeight = inputHeight;
  if (inputWidth > width || inputHeight > height) {
    if (inputWidth / inputHeight > 1) {
      // 宽图片
      targetWidth = width;
      targetHeight = Math.round(width * (inputHeight / inputWidth));
    } else {
      // 高图片
      targetHeight = height;
      targetWidth = Math.round(width * (inputWidth / inputHeight));
    }
  }
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  if (context != null) {
    context.clearRect(0, 0, targetWidth, targetHeight);
    // 图片绘制
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
  }
  return canvas.toDataURL(outputType, quality);
};
