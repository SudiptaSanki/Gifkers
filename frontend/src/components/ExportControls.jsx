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
        className="bg-black border border-zinc-700 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer text-zinc-200"
      >
        <option value="gif">Animated (.gif)</option>
        <option value="png">Static (.png)</option>
        <option value="jpeg">Static (.jpeg)</option>
        <option value="sticker">WhatsApp Sticker (.webp)</option>
      </select>

      <button
        onClick={onDownload}
        disabled={!stickerData}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-md"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  );
}
