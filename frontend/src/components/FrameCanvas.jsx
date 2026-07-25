import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export function FrameCanvas({
  stickerRef,
  customWidth,
  customHeight,
  stickerData,
  error
}) {
  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-zinc-950 rounded-xl border border-zinc-800 relative overflow-hidden min-h-[450px]">
      
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-950/80 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm whitespace-pre-wrap z-20 shadow-xl">
          {error}
        </div>
      )}

      {/* Clean Original Sticker Display */}
      <div 
        ref={stickerRef}
        className="relative flex items-center justify-center transition-all duration-300 max-w-full max-h-full"
        style={{
          width: customWidth ? `${customWidth}px` : 'auto',
          height: customHeight ? `${customHeight}px` : 'auto',
          aspectRatio: customWidth && customHeight ? `${customWidth} / ${customHeight}` : 'auto'
        }}
      >
        {stickerData ? (
          <img 
            src={stickerData} 
            alt="Generated Sticker" 
            className="max-w-full max-h-full object-contain drop-shadow-xl" 
          />
        ) : (
          <div className="flex flex-col items-center text-zinc-600 gap-3 border-2 border-dashed border-zinc-800/80 p-12 rounded-xl">
            <ImageIcon className="w-12 h-12 opacity-40" />
            <p className="text-sm font-medium">Click Generate to preview your sticker</p>
          </div>
        )}
      </div>

    </div>
  );
}
