/**
 * Downloads the generated sticker in the chosen format.
 *
 * Format logic:
 *  - "raw"  → saves whatever the backend returned as-is (preserves animated GIF)
 *  - "gif"  → saves as GIF (same as raw if backend already returned gif)
 *  - "png"  → converts to PNG (first frame only if source is GIF)
 *  - "jpeg" → converts to JPEG (first frame only if source is GIF)
 */
export const downloadSticker = async ({
  stickerData,
  exportFormat,
  rawMimeType,
}) => {
  if (!stickerData) return;

  const isGif = rawMimeType === 'image/gif';

  // Raw / GIF — download as-is to preserve animation
  if (exportFormat === 'raw' || exportFormat === 'gif') {
    const link = document.createElement('a');
    link.download = isGif ? 'sticker.gif' : 'sticker.png';
    link.href = stickerData;
    link.click();
    return;
  }

  // PNG or JPEG — render first frame onto canvas and export
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = stickerData;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');

    if (exportFormat === 'jpeg') {
      // Fill white background for JPEG (no transparency)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    const mimeOut = exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = exportFormat === 'jpeg' ? 0.95 : undefined;
    const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `sticker.${ext}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      },
      mimeOut,
      quality
    );
  } catch (err) {
    console.error('Export failed:', err);
  }
};
