import { toPng, toJpeg, toSvg } from 'html-to-image';

export const downloadSticker = async ({
  stickerData,
  exportFormat,
  rawMimeType,
  elementRef
}) => {
  if (!stickerData) return;

  // 1. Raw Output Download (Only the main sticker/GIF graphic without outer window mockup)
  if (exportFormat === 'raw') {
    const link = document.createElement('a');
    const ext = rawMimeType === 'image/gif' ? 'gif' : 'png';
    link.download = `sticker.${ext}`;
    link.href = stickerData;
    link.click();
    return;
  }

  // 2. Framed Card Export
  if (!elementRef?.current) return;
  try {
    const el = elementRef.current;
    const options = {
      width: el.offsetWidth,
      height: el.offsetHeight,
      style: {
        transform: 'none',
        margin: '0',
      },
      pixelRatio: 3,
      cacheBust: true
    };

    let dataUrl;
    let filename = 'python_sticker.png';

    if (exportFormat === 'jpeg') {
      dataUrl = await toJpeg(el, { ...options, quality: 0.95 });
      filename = 'python_sticker.jpg';
    } else if (exportFormat === 'svg') {
      dataUrl = await toSvg(el, options);
      filename = 'python_sticker.svg';
    } else {
      dataUrl = await toPng(el, options);
      filename = 'python_sticker.png';
    }

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export sticker image:', err);
  }
};
