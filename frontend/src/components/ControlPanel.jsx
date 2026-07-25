import React from 'react';
import { ExportControls } from './ExportControls';

export function ControlPanel({
  aspectRatio,
  onRatioChange,
  detectedWidth,
  detectedHeight,
  customWidth,
  onWidthChange,
  customHeight,
  onHeightChange,
  exportFormat,
  setExportFormat,
  rawMimeType,
  stickerData,
  onDownload
}) {
  return (
    <div className="flex flex-wrap items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800 gap-4">
      {/* Aspect Ratio & Pixel Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-zinc-400">Canvas Size:</span>
        <select 
          value={aspectRatio} 
          onChange={(e) => onRatioChange(e.target.value)}
          className="bg-black border border-zinc-700 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer text-zinc-200"
        >
          <option value="auto">
            Auto / Follow Code {detectedWidth ? `(${detectedWidth} × ${detectedHeight} px)` : ''}
          </option>
          <option value="1:1">Square (1:1)</option>
          <option value="4:5">Instagram (4:5)</option>
          <option value="16:9">Banner (16:9)</option>
          <option value="9:16">Story (9:16)</option>
          <option value="custom">Custom</option>
        </select>

        {/* Pixel inputs */}
        <div className="flex items-center gap-1.5 bg-black border border-zinc-700 px-3 py-1 rounded">
          <input 
            type="number" 
            value={customWidth} 
            onChange={(e) => onWidthChange(e.target.value)}
            placeholder="W" 
            className="w-14 bg-transparent border-none text-sm text-center focus:outline-none text-blue-400 font-medium"
          />
          <span className="text-zinc-500 font-bold">×</span>
          <input 
            type="number" 
            value={customHeight} 
            onChange={(e) => onHeightChange(e.target.value)}
            placeholder="H" 
            className="w-14 bg-transparent border-none text-sm text-center focus:outline-none text-blue-400 font-medium"
          />
          <span className="text-xs text-zinc-400">px</span>
        </div>
      </div>

      {/* Download controls */}
      <ExportControls 
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        rawMimeType={rawMimeType}
        stickerData={stickerData}
        onDownload={onDownload}
      />
    </div>
  );
}
