// 压缩图像
function compressPicture(img,size) {
    const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        w = img.width,
        h = img.height;
    if (Math.max(w, h) > size) {
        if (w > h) {
            canvas.width = size;
            canvas.height = h / w * size;
        } else {
            canvas.height = size;
            canvas.width = w / h * size;
        }
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
}

export default {
    compressPicture
}