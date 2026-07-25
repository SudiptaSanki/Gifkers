import React from 'react';
import { Download } from 'lucide-react';

export function ExportControls({
  rawMimeType,
  stickerData,
  onDownload
}) {
  const fileTypeLabel = rawMimeType === 'image/gif' ? 'GIF Animation' : 'PNG Sticker';

  return (
    <div className="flex items-center gap-3 ml-auto">
      <span className="text-xs text-zinc-400 font-medium">Format: {fileTypeLabel}</span>
      <button 
        onClick={onDownload}
        disabled={!stickerData}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-md"
      >
        <Download className="w-4 h-4" />
        Download Sticker
      </button>
    </div>
  );
}
