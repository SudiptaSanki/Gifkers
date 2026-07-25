import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2 } from 'lucide-react';

export function CodeEditor({ code, setCode, onGenerate, loading }) {
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Gifkers
        </h1>
        <button 
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-lg cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Generate
        </button>
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
    </div>
  );
}
