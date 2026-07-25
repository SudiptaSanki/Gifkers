import { useState, useRef } from 'react';
import { generateStickerApi } from '../utils/api';
import { downloadSticker } from '../utils/exportImage';

const DEFAULT_CODE = `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(6, 4))
plt.plot(x, y, color='#3b82f6', linewidth=2)
plt.title("Sine Wave", color='white')
plt.grid(True, alpha=0.2)
plt.gca().set_facecolor('none')
plt.gcf().patch.set_facecolor('none')
plt.tick_params(colors='white')
plt.show()
`;

export function useStickerGenerator() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [loading, setLoading] = useState(false);
  const [stickerData, setStickerData] = useState(null);
  const [rawMimeType, setRawMimeType] = useState('image/png');
  const [error, setError] = useState(null);
  const stickerRef = useRef(null);

  const [aspectRatio, setAspectRatio] = useState("auto");
  const [detectedWidth, setDetectedWidth] = useState(null);
  const [detectedHeight, setDetectedHeight] = useState(null);
  const [customWidth, setCustomWidth] = useState(600);
  const [customHeight, setCustomHeight] = useState(600);
  const [exportFormat, setExportFormat] = useState("raw");
  const [themeGradient, setThemeGradient] = useState("linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)");

  const handleRatioChange = (newRatio) => {
    setAspectRatio(newRatio);
    if (newRatio === "auto") {
      if (detectedWidth && detectedHeight) {
        setCustomWidth(detectedWidth);
        setCustomHeight(detectedHeight);
      }
    } else if (newRatio === "1:1") {
      setCustomWidth(600);
      setCustomHeight(600);
    } else if (newRatio === "4:5") {
      setCustomWidth(480);
      setCustomHeight(600);
    } else if (newRatio === "16:9") {
      setCustomWidth(640);
      setCustomHeight(360);
    } else if (newRatio === "9:16") {
      setCustomWidth(360);
      setCustomHeight(640);
    }
  };

  const updateMatchedRatio = (w, h) => {
    if (!w || !h) return;
    if (detectedWidth && detectedHeight && w === detectedWidth && h === detectedHeight) {
      setAspectRatio("auto");
      return;
    }
    const r = w / h;
    if (Math.abs(r - 1.0) < 0.03) {
      setAspectRatio("1:1");
    } else if (Math.abs(r - 0.8) < 0.03) {
      setAspectRatio("4:5");
    } else if (Math.abs(r - (16/9)) < 0.05) {
      setAspectRatio("16:9");
    } else if (Math.abs(r - (9/16)) < 0.05) {
      setAspectRatio("9:16");
    } else {
      setAspectRatio("custom");
    }
  };

  const handleWidthChange = (val) => {
    const w = Math.max(10, Number(val));
    setCustomWidth(w);
    updateMatchedRatio(w, customHeight);
  };

  const handleHeightChange = (val) => {
    const h = Math.max(10, Number(val));
    setCustomHeight(h);
    updateMatchedRatio(customWidth, h);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setStickerData(null);
    try {
      const data = await generateStickerApi({
        code: code,
        aspect_ratio: aspectRatio,
        width: customWidth,
        height: customHeight
      });

      if (data.status === 'success' && data.image_base64) {
        const mimeType = data.mime_type || 'image/png';
        setRawMimeType(mimeType);
        setStickerData(`data:${mimeType};base64,${data.image_base64}`);
        setExportFormat('raw');

        if (data.width && data.height) {
          setDetectedWidth(data.width);
          setDetectedHeight(data.height);
          if (aspectRatio === "auto") {
            setCustomWidth(data.width);
            setCustomHeight(data.height);
          }
        }
      } else {
        setError('Code executed, but no image was generated.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = async () => {
    await downloadSticker({
      stickerData,
      exportFormat,
      rawMimeType,
      elementRef: stickerRef
    });
  };

  return {
    code,
    setCode,
    loading,
    stickerData,
    rawMimeType,
    error,
    stickerRef,
    aspectRatio,
    handleRatioChange,
    detectedWidth,
    detectedHeight,
    customWidth,
    customHeight,
    handleWidthChange,
    handleHeightChange,
    exportFormat,
    setExportFormat,
    themeGradient,
    setThemeGradient,
    handleGenerate,
    triggerDownload
  };
}
