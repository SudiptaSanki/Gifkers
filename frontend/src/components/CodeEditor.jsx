import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2 } from 'lucide-react';
import { DEFAULT_STATIC_CODE, DEFAULT_GIF_CODE } from '../utils/templates';

export function CodeEditor({ code, setCode, onGenerate, loading }) {
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Brand Logo next to Text */}
          <img src="/favicon.png" alt="Gifkers Logo" className="w-8 h-8 drop-shadow-md rounded" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Gifkers
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            onChange={(e) => {
              if (e.target.value === 'static') setCode(DEFAULT_STATIC_CODE);
              if (e.target.value === 'gif') setCode(DEFAULT_GIF_CODE);
            }}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Load Template...</option>
            <option value="static">Static (Sine Wave)</option>
            <option value="gif">Animated (Flashing Welcome)</option>
          </select>

          <button 
            onClick={onGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-lg cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Generate
          </button>
        </div>
      </div>
      
      <div className="flex-grow rounded-xl overflow-hidden border border-zinc-800 shadow-xl min-h-[500px]">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 }
          }}
        />
      </div>

      <div className="text-xs text-zinc-500 text-center px-4">
        <strong>⚠️ Disclaimer:</strong> You are executing arbitrary Python code at your own risk. 
        Gifkers is not responsible for infinite loops, resource exhaustion, or any damage to older machines caused by broken code.
      </div>
    </div>
  );
}
