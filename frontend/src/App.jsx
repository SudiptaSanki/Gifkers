import React from 'react';
import { useStickerGenerator } from './hooks/useStickerGenerator';
import { CodeEditor } from './components/CodeEditor';
import { ControlPanel } from './components/ControlPanel';
import { FrameCanvas } from './components/FrameCanvas';

function App() {
  const {
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
    handleGenerate,
    triggerDownload
  } = useStickerGenerator();

  return (
    <div className="min-h-screen p-6 flex flex-col md:flex-row gap-6 bg-black text-zinc-100 font-sans">
      {/* Code Editor Column */}
      <CodeEditor 
        code={code}
        setCode={setCode}
        onGenerate={handleGenerate}
        loading={loading}
      />

      {/* Preview Column */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <ControlPanel 
          aspectRatio={aspectRatio}
          onRatioChange={handleRatioChange}
          detectedWidth={detectedWidth}
          detectedHeight={detectedHeight}
          customWidth={customWidth}
          onWidthChange={handleWidthChange}
          customHeight={customHeight}
          onHeightChange={handleHeightChange}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          rawMimeType={rawMimeType}
          stickerData={stickerData}
          onDownload={triggerDownload}
        />

        <FrameCanvas 
          stickerRef={stickerRef}
          customWidth={customWidth}
          customHeight={customHeight}
          stickerData={stickerData}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;
