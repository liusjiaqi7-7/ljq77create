import React, { useState, useEffect } from 'react';
import { INITIAL_LEVELS } from './constants';
import { GameState, Level, UserState } from './types';
import LevelMap from './components/LevelMap';
import GameLevel from './components/GameLevel';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.DASHBOARD);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  
  // Persist state simply using local variable for this session, 
  // in a real app use localStorage or DB.
  const [userState, setUserState] = useState<UserState>({
    xp: 0,
    level: 1,
    streak: 0,
    completedLevels: []
  });

  const [levels, setLevels] = useState<Level[]>(INITIAL_LEVELS);

  const handleSelectLevel = (level: Level) => {
    setCurrentLevel(level);
    setGameState(GameState.PLAYING);
  };

  const handleLevelComplete = (xpEarned: number) => {
    if (!currentLevel) return;

    // Victory animation or sound could go here
    
    setUserState(prev => {
      const isReplay = prev.completedLevels.includes(currentLevel.id);
      // Give reduced XP for replays
      const actualXp = isReplay ? Math.floor(xpEarned / 4) : xpEarned; 
      
      const newCompleted = isReplay 
        ? prev.completedLevels 
        : [...prev.completedLevels, currentLevel.id];

      return {
        ...prev,
        xp: prev.xp + actualXp,
        completedLevels: newCompleted,
        level: prev.level // Logic to level up user profile could go here
      };
    });

    // Unlock next level in local state
    setLevels(prevLevels => prevLevels.map(lvl => {
      if (lvl.id === currentLevel.id + 1) {
        return { ...lvl, locked: false };
      }
      return lvl;
    }));

    // Return to dashboard after short delay or show victory modal
    // For now, immediately go back to dashboard to show progress
    setTimeout(() => {
        setGameState(GameState.DASHBOARD);
        setCurrentLevel(null);
    }, 1000);
  };

  const handleExitLevel = () => {
    setGameState(GameState.DASHBOARD);
    setCurrentLevel(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-green-500/30 selection:text-green-200">
      
      {gameState === GameState.DASHBOARD && (
        <div className="relative z-10">
          {/* Background decoration */}
          <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-blue-500"></div>
          
          <LevelMap 
            levels={levels} 
            completedLevels={userState.completedLevels} 
            onSelectLevel={handleSelectLevel}
            userXp={userState.xp}
          />
        </div>
      )}

      {gameState === GameState.PLAYING && currentLevel && (
        <GameLevel 
          level={currentLevel} 
          onExit={handleExitLevel}
          onComplete={handleLevelComplete}
        />
      )}
    </div>
  );
};

export default App;