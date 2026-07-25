import React from 'react';
import { Download } from 'lucide-react';

export function ExportControls({
  exportFormat,
  setExportFormat,
  rawMimeType,
  stickerData,
  onDownload
}) {
  const isGif = rawMimeType === 'image/gif';

  return (
    <div className="flex items-center gap-2 ml-auto">
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value)}
        className="bg-black border border-zinc-700 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer text-zinc-200"
      >
        {/* Default: preserve animated GIF if backend returned one */}
        <option value="raw">
          {isGif ? 'GIF Sticker (Animated)' : 'PNG Sticker'}
        </option>
        {/* Always offer GIF option so user can request animated output */}
        {!isGif && (
          <option value="gif">GIF Sticker (Animated)</option>
        )}
        <option value="png">PNG Sticker (Static)</option>
        <option value="jpeg">JPEG Sticker (Static)</option>
      </select>

      <button
        onClick={onDownload}
        disabled={!stickerData}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-md"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  );
}
