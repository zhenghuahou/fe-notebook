const convertFile2Image = async (file) => {
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
const DEFULT_IMG_CONFIG = {
  width: 918,
  height: 1188,
  quality: 0.85,
};
const base64HeaderExp = /^data:image\/\w+;base64,/;
const BASE64_HEADER = "data:image/jpeg;base64,";
const convertBase2Image = async (base64) => {
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
const compressImage = async (
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

const useImageCatch = () => {
  let base64Data = "";
  const fileDom = document.getElementById("upload");
  console.info(' fileDom:',fileDom)
  const commonImageCatch = async () => {
    // console.log('调用公共拍摄hooks');
    // 获取拍摄的图片
    const file = fileDom.files[0];
    // 初始化节点
    const rst = await fileProgressr(file);
    console.info('106 rst:',rst)
    return rst;
  };

  const commonImageCatchByEncode = async () => {
    // console.log('调用公共拍摄hooks');
    // 获取拍摄的图片
    const file = fileDom.files[0];
    const buffer = await file.arrayBuffer();
    const imgBase64 = encode(new Uint8Array(buffer));
    return imgBase64;
  };

  // 处理拍摄到的图片文件
  const fileProgressr = async (file) => {
    // 文件转为Image对象
    const img = await convertFile2Image(file);
    let processedBase64;
    // console.log("convertFile2Image执行结束 ==> Image对象 img:", img);
    processedBase64 = await compressImage(img);
    // console.log("compressImage执行结束 ==> 压缩后图片：", processedBase64);
    base64Data = processedBase64.replace(base64HeaderExp, "");
    return base64Data
  };

  return {
    fileDom,
    // base64Data,
    commonImageCatch,
    commonImageCatchByEncode,
  };
};

function encode(input) {
  var keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN;
    chr3 = i < input.length ? input[i++] : Number.NaN;

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
  }
  return output;
}
