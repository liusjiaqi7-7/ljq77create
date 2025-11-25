import React, { useState, useEffect } from 'react';
import { Level, CodeValidationResult, ChatMessage } from '../types';
import { validatePythonCode, getAIHint } from '../services/geminiService';
import { Play, ArrowLeft, Cpu, AlertCircle, Sparkles, Terminal as TerminalIcon, HelpCircle } from 'lucide-react';

interface GameLevelProps {
  level: Level;
  onExit: () => void;
  onComplete: (xp: number) => void;
}

const GameLevel: React.FC<GameLevelProps> = ({ level, onExit, onComplete }) => {
  const [code, setCode] = useState(level.starterCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [validationResult, setValidationResult] = useState<CodeValidationResult | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<ChatMessage[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");

  // Reset state when level changes
  useEffect(() => {
    setCode(level.starterCode);
    setOutput('');
    setValidationResult(null);
    setFeedbackHistory([]);
    setShowHint(false);
  }, [level]);

  const handleRun = async () => {
    setIsRunning(true);
    setValidationResult(null);
    setOutput('Initializing execution context...\nAnalyzing syntax...\n');

    const result = await validatePythonCode(code, level.missionObjective, level.topic);
    
    setValidationResult(result);
    setOutput(result.output);
    setIsRunning(false);

    if (result.correct) {
      // Delay completion slightly for effect
      setTimeout(() => {
        onComplete(level.xpReward);
      }, 2000);
    }
  };

  const handleGetHint = async () => {
    if (hintText) {
      setShowHint(true);
      return;
    }
    const hint = await getAIHint(code, level.missionObjective);
    setHintText(hint);
    setShowHint(true);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 flex items-center px-6 bg-gray-900/50 backdrop-blur justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold font-mono text-green-400 flex items-center gap-2">
              <Cpu size={16} /> MODULE {level.id}: {level.title.toUpperCase()}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-gray-500">Reward: <span className="text-yellow-400">{level.xpReward} XP</span></span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Mission & Instructions */}
        <div className="w-1/3 border-r border-gray-800 flex flex-col bg-gray-900/20">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">Mission Objective</h3>
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg text-blue-100 font-medium">
                {level.missionObjective}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">Context</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {level.description}
              </p>
            </div>

            <div>
               <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">System Guidance</h3>
               <div className="space-y-2">
                  {level.hints.map((hint, idx) => (
                    <div key={idx} className="flex gap-2 text-sm text-gray-400">
                      <span className="text-green-500">•</span>
                      <span>{hint}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="mt-8">
               <button 
                onClick={handleGetHint}
                className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
               >
                 <HelpCircle size={14} />
                 Request AI Assistance
               </button>
               {showHint && (
                 <div className="mt-2 p-3 bg-purple-900/20 border border-purple-500/30 rounded text-purple-200 text-sm font-mono animate-pulse">
                   "{hintText}"
                 </div>
               )}
            </div>

          </div>
        </div>

        {/* Right Panel: Editor & Terminal */}
        <div className="w-2/3 flex flex-col bg-[#1e1e1e]">
          {/* Code Editor Area */}
          <div className="flex-1 relative flex flex-col">
            <div className="bg-[#252526] text-gray-400 text-xs px-4 py-2 flex items-center gap-2 border-b border-[#333]">
              <span className="text-yellow-500">●</span> script.py
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-[#1e1e1e] text-gray-300 font-mono p-4 resize-none focus:outline-none focus:ring-0 leading-relaxed custom-caret text-sm"
              spellCheck="false"
              placeholder="# Write your python code here..."
            />
            
            {/* Run Button Overlay */}
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all
                  ${isRunning 
                    ? 'bg-gray-600 cursor-wait text-gray-300' 
                    : 'bg-green-600 hover:bg-green-500 text-white hover:scale-105 active:scale-95'
                  }
                `}
              >
                {isRunning ? (
                  <>
                    <Cpu className="animate-spin" size={18} /> PROCESSING
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" /> EXECUTE
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Terminal / Output */}
          <div className="h-1/3 bg-black border-t border-gray-700 flex flex-col">
            <div className="bg-[#1a1a1a] px-4 py-1 text-gray-500 text-xs font-mono border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TerminalIcon size={12} /> OUTPUT TERMINAL
              </div>
              {validationResult?.correct && <span className="text-green-500 font-bold">SUCCESS</span>}
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto font-medium">
              {!output && !isRunning && <span className="text-gray-600 italic">Waiting for execution...</span>}
              
              <pre className={`whitespace-pre-wrap ${validationResult?.correct ? 'text-green-400' : 'text-gray-300'}`}>
                {output}
              </pre>

              {validationResult && !validationResult.correct && (
                <div className="mt-4 p-3 bg-red-900/20 border-l-2 border-red-500 text-red-200 text-sm">
                  <div className="flex items-center gap-2 mb-1 text-red-400 font-bold">
                    <AlertCircle size={14} /> ERROR DIAGNOSTIC:
                  </div>
                  {validationResult.feedback}
                </div>
              )}
               {validationResult && validationResult.correct && (
                <div className="mt-4 p-3 bg-green-900/20 border-l-2 border-green-500 text-green-200 text-sm">
                  <div className="flex items-center gap-2 mb-1 text-green-400 font-bold">
                    <Sparkles size={14} /> SYSTEM RESTORED:
                  </div>
                  {validationResult.feedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLevel;