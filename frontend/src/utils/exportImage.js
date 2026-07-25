/**
 * Downloads the generated sticker in the chosen format.
 *
 * Format logic:
 *  - "raw" / "gif" : saves whatever the backend returned as-is (preserves animated GIF)
 *  - "png"         : converts to PNG (first frame only if source is GIF)
 *  - "jpeg"        : converts to JPEG (first frame only if source is GIF, with white bg)
 *  - "sticker"     : converts to 512x512 WebP for WhatsApp (first frame static)
 */
export const downloadSticker = async ({
  stickerData,
  exportFormat,
  rawMimeType,
}) => {
  if (!stickerData) return;

  const isGif = rawMimeType === 'image/gif';

  // 1. Raw / GIF — download as-is to preserve animation
  if (exportFormat === 'raw' || exportFormat === 'gif') {
    const link = document.createElement('a');
    link.download = isGif ? 'sticker.gif' : 'sticker.png';
    link.href = stickerData;
    link.click();
    return;
  }

  // 2. PNG, JPEG, or WebP Sticker — render onto canvas
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = stickerData;
    });

    const canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    // WhatsApp stickers must be exactly 512x512
    if (exportFormat === 'sticker') {
      canvas.width = 512;
      canvas.height = 512;
      
      // Calculate scaling to fit within 512x512 while maintaining aspect ratio
      const scale = Math.min(512 / img.naturalWidth, 512 / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const offsetX = (512 - drawW) / 2;
      const offsetY = (512 - drawH) / 2;
      
      ctx.clearRect(0, 0, 512, 512); // Transparent background
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    } else {
      // Normal PNG or JPEG retains original dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      if (exportFormat === 'jpeg') {
        // Fill white background for JPEG (no transparency)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
    }

    // Determine output mime type and extension
    let mimeOut = 'image/png';
    let ext = 'png';
    let quality = undefined;

    if (exportFormat === 'jpeg') {
      mimeOut = 'image/jpeg';
      ext = 'jpg';
      quality = 0.95;
    } else if (exportFormat === 'sticker') {
      mimeOut = 'image/webp';
      ext = 'webp';
      quality = 0.90; // High quality for WhatsApp
    }

    // Export blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `whatsapp-sticker.${ext}`;
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
