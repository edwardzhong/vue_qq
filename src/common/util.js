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

function formatTime (i) {
    const d = new Date(String(i)),
        n = new Date(),
        day = n.getDate() - d.getDate(),
        date = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
    if (day == 0) {
        i = `${date}`
    } else if (day == 1) {
        i = `昨天 ${date}`
    } else {
        i = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${date}`
    }
    return i;
}

export {
    compressPicture,
    formatTime
}