import React from 'react';
import { Download } from 'lucide-react';

export function ExportControls({
  exportFormat,
  setExportFormat,
  rawMimeType,
  stickerData,
  onDownload
}) {
  return (
    <div className="flex items-center gap-2 ml-auto">
      <select 
        value={exportFormat} 
        onChange={(e) => setExportFormat(e.target.value)}
        className="bg-black border border-zinc-700 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      >
        <option value="raw">
          Raw Sticker ({rawMimeType === 'image/gif' ? 'GIF Animation' : 'PNG Graphic'})
        </option>
        <option value="png">Framed Mockup (PNG)</option>
        <option value="jpeg">Framed Mockup (JPEG)</option>
        <option value="svg">Framed Mockup (SVG)</option>
      </select>

      <button 
        onClick={onDownload}
        disabled={!stickerData}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  );
}
