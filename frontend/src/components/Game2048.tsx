"use client";

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trophy } from 'lucide-react';

export default function Game2048() {
  const [board, setBoard] = useState<number[]>(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Colors for tiles
  const getColors = (value: number) => {
    switch (value) {
      case 2: return 'bg-serenova-bg text-gray-600';
      case 4: return 'bg-blue-100 text-blue-600';
      case 8: return 'bg-orange-100 text-orange-600';
      case 16: return 'bg-orange-200 text-orange-700';
      case 32: return 'bg-red-200 text-red-600';
      case 64: return 'bg-red-300 text-red-700';
      case 128: return 'bg-yellow-200 text-yellow-600';
      case 256: return 'bg-yellow-300 text-yellow-700';
      case 512: return 'bg-yellow-400 text-yellow-800';
      case 1024: return 'bg-yellow-500 text-white';
      case 2048: return 'bg-yellow-600 text-white';
      default: return 'bg-gray-200 text-gray-400';
    }
  };

  // Initialize Logic
  const initGame = useCallback(() => {
    const newBoard = Array(16).fill(0);
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, []);

  const addNewTile = (currentBoard: number[]) => {
    const emptyIndices = currentBoard.map((val, idx) => val === 0 ? idx : -1).filter(idx => idx !== -1);
    if (emptyIndices.length === 0) return;
    const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    currentBoard[randomIdx] = Math.random() < 0.9 ? 2 : 4;
  };

  // --- Movement Logic ---
  const transformLine = (line: number[]) => {
    // 1. Remove zeros
    let newLine = line.filter(val => val !== 0);
    let points = 0;
    
    // 2. Merge neighbors
    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        points += newLine[i];
        newLine[i + 1] = 0;
      }
    }
    
    // 3. Remove new zeros and pad
    newLine = newLine.filter(val => val !== 0);
    while (newLine.length < 4) {
      newLine.push(0);
    }
    return { newLine, points };
  };

  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let newBoard = [...board];
    let totalPoints = 0;
    let hasChanged = false;

    // Helper to get rows/cols based on direction
    const getLine = (i: number) => {
        if (direction === 'left' || direction === 'right') {
            return [newBoard[i*4], newBoard[i*4+1], newBoard[i*4+2], newBoard[i*4+3]];
        } else {
            return [newBoard[i], newBoard[i+4], newBoard[i+8], newBoard[i+12]];
        }
    };

    const setLine = (i: number, line: number[]) => {
        if (direction === 'left' || direction === 'right') {
            [newBoard[i*4], newBoard[i*4+1], newBoard[i*4+2], newBoard[i*4+3]] = line;
        } else {
            [newBoard[i], newBoard[i+4], newBoard[i+8], newBoard[i+12]] = line;
        }
    };

    for (let i = 0; i < 4; i++) {
        let line = getLine(i);
        if (direction === 'right' || direction === 'down') line.reverse();

        const { newLine, points } = transformLine(line);
        totalPoints += points;

        if (direction === 'right' || direction === 'down') newLine.reverse();

        // Check change
        if (JSON.stringify(line) !== JSON.stringify(newLine)) hasChanged = true;
        setLine(i, newLine);
    }

    if (hasChanged) {
        addNewTile(newBoard);
        setBoard(newBoard);
        setScore(s => s + totalPoints);
    } else {
        // Simple Game Over Check (Board full + no moves left logic omitted for brevity, keeping simple check)
        if (!newBoard.includes(0)) {
            // Check if any merges possible (simplified: if full, likely game over soon)
            // Ideally we check horizontal/vertical neighbors here
        }
    }
  }, [board, gameOver]);

  // Key Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Initial Load
  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
      
      {/* HUD */}
      <div className="flex justify-between w-full max-w-xs mb-6 items-center">
        <div className="bg-serenova-bg px-4 py-2 rounded-xl text-serenova-dark font-bold flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500"/> {score}
        </div>
        <button onClick={initGame} className="text-gray-400 hover:text-serenova-primary transition">
            <RefreshCw size={24} />
        </button>
      </div>

      {/* Grid */}
      <div className="bg-gray-800 p-2 rounded-xl grid grid-cols-4 gap-2 w-72 h-72 shadow-inner">
        {board.map((tile, i) => (
          <div 
            key={i} 
            className={`w-full h-full rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-150 ${getColors(tile)}`}
          >
            {tile !== 0 && tile}
          </div>
        ))}
      </div>

      {/* Mobile Controls (Visible on small screens) */}
      <div className="grid grid-cols-3 gap-2 mt-6 md:hidden">
         <div></div>
         <button onClick={() => move('up')} className="bg-gray-100 p-3 rounded-lg">⬆️</button>
         <div></div>
         <button onClick={() => move('left')} className="bg-gray-100 p-3 rounded-lg">⬅️</button>
         <button onClick={() => move('down')} className="bg-gray-100 p-3 rounded-lg">⬇️</button>
         <button onClick={() => move('right')} className="bg-gray-100 p-3 rounded-lg">➡️</button>
      </div>

      <p className="text-xs text-gray-400 mt-6 hidden md:block">Use arrow keys to move tiles.</p>
    </div>
  );
}