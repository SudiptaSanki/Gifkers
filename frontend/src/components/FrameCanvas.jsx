import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export function FrameCanvas({
  stickerRef,
  customWidth,
  customHeight,
  themeGradient,
  stickerData,
  error
}) {
  return (
    <div className="flex-grow flex items-center justify-center p-8 bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-zinc-900/50 rounded-xl border border-zinc-800/50 relative overflow-hidden min-h-[450px]">
      
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm whitespace-pre-wrap z-20">
          {error}
        </div>
      )}

      {/* Responsive Sticker Frame container */}
      <div 
        ref={stickerRef}
        className="relative flex items-center justify-center p-6 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          width: '100%',
          maxWidth: `${customWidth}px`,
          aspectRatio: `${customWidth} / ${customHeight}`,
          background: themeGradient
        }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full h-full bg-black/80 rounded-xl shadow-inner border border-white/20 flex flex-col p-4">
          
          {/* Window Controls (Mac style) */}
          <div className="flex gap-2 mb-3 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          {/* Content Area */}
          <div className="flex-grow flex items-center justify-center overflow-hidden">
            {stickerData ? (
              <img src={stickerData} alt="Generated Sticker" className="max-w-full max-h-full object-contain drop-shadow-lg" />
            ) : (
              <div className="flex flex-col items-center text-zinc-500 gap-2">
                <ImageIcon className="w-12 h-12 opacity-50" />
                <p className="text-sm font-medium">Run code to generate sticker</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
