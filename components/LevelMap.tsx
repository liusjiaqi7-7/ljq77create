import React from 'react';
import { Level } from '../types';
import { Lock, Unlock, Zap, Terminal, CheckCircle } from 'lucide-react';

interface LevelMapProps {
  levels: Level[];
  completedLevels: number[];
  onSelectLevel: (level: Level) => void;
  userXp: number;
}

const LevelMap: React.FC<LevelMapProps> = ({ levels, completedLevels, onSelectLevel, userXp }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      <header className="mb-10 flex justify-between items-center border-b border-green-900/30 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 font-mono tracking-tighter">
            PY_CORE // NEURAL_LINK
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm">Select a module to begin calibration.</p>
        </div>
        <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg border border-green-500/20">
          <Zap className="text-yellow-400 w-6 h-6 fill-yellow-400/20" />
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">System Energy</div>
            <div className="text-2xl font-bold font-mono text-white">{userXp} XP</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => {
          const isCompleted = completedLevels.includes(level.id);
          const isLocked = level.locked && !isCompleted && !completedLevels.includes(level.id - 1) && level.id !== 1;
          // Override lock if previous level is done
          const actualLocked = level.id === 1 ? false : !completedLevels.includes(level.id - 1);

          return (
            <button
              key={level.id}
              disabled={actualLocked}
              onClick={() => onSelectLevel(level)}
              className={`
                relative group overflow-hidden rounded-xl border-2 p-6 text-left transition-all duration-300
                ${actualLocked 
                  ? 'border-gray-800 bg-gray-900/40 opacity-60 cursor-not-allowed' 
                  : 'border-green-500/30 bg-gray-900/80 hover:border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                }
              `}
            >
              <div className="absolute top-0 right-0 p-4">
                 {isCompleted ? (
                   <CheckCircle className="text-green-500 w-6 h-6" />
                 ) : actualLocked ? (
                   <Lock className="text-gray-600 w-5 h-5" />
                 ) : (
                   <Unlock className="text-green-400 w-5 h-5 animate-pulse" />
                 )}
              </div>

              <div className="mb-4">
                <span className={`
                  text-xs font-bold px-2 py-1 rounded border
                  ${level.difficulty === 'Novice' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : ''}
                  ${level.difficulty === 'Adept' ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' : ''}
                  ${level.difficulty === 'Expert' ? 'border-red-500/50 text-red-400 bg-red-500/10' : ''}
                `}>
                  {level.difficulty.toUpperCase()}
                </span>
              </div>

              <h3 className={`text-xl font-bold font-mono mb-2 ${actualLocked ? 'text-gray-500' : 'text-white'}`}>
                {level.id < 10 ? `0${level.id}` : level.id} // {level.title}
              </h3>
              <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">
                {level.description}
              </p>

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                <Terminal size={14} />
                <span>{level.topic}</span>
              </div>
              
              {!actualLocked && !isCompleted && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/0 group-hover:bg-green-500 transition-all duration-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelMap;