import React from 'react';

const GRADIENTS = [
  { name: 'Electric Cyan', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Sunset Glow', value: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' },
  { name: 'Neon Cyberpunk', value: 'linear-gradient(135deg, #f107a3 0%, #7b2cbf 100%)' },
  { name: 'Emerald Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Deep Onyx', value: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }
];

export function ThemeSelector({ currentGradient, onSelectTheme }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-400">Card Theme:</span>
      <div className="flex items-center gap-1.5">
        {GRADIENTS.map((g) => (
          <button
            key={g.name}
            title={g.name}
            onClick={() => onSelectTheme(g.value)}
            className={`w-5 h-5 rounded-full border border-white/20 transition-transform ${
              currentGradient === g.value ? 'scale-125 ring-2 ring-blue-500' : 'hover:scale-110'
            }`}
            style={{ background: g.value }}
          />
        ))}
      </div>
    </div>
  );
}
