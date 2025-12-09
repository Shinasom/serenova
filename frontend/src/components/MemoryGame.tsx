"use client";

import { useState, useEffect } from 'react';
import { Sun, Cloud, Moon, Star, Umbrella, Heart, Leaf, Flower2 } from 'lucide-react';

const ICONS = [Sun, Cloud, Moon, Star, Umbrella, Heart, Leaf, Flower2];

type Card = {
  id: number;
  iconId: number;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);

  // Initialize Game
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    // Create pairs
    const gameCards = [...ICONS, ...ICONS].map((_, index) => ({
      id: index,
      iconId: Math.floor(index % 8),
      isFlipped: false,
      isMatched: false,
    }));
    
    // Shuffle
    gameCards.sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlippedIds([]);
    setIsWon(false);
  };

  const handleCardClick = (id: number) => {
    // Ignore if already flipped, matched, or if 2 cards already open
    if (flippedIds.length === 2 || cards.find(c => c.id === id)?.isFlipped || cards.find(c => c.id === id)?.isMatched) return;

    // Flip the card
    const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    // Check Match
    if (newFlipped.length === 2) {
      const card1 = newCards.find(c => c.id === newFlipped[0]);
      const card2 = newCards.find(c => c.id === newFlipped[1]);

      if (card1?.iconId === card2?.iconId) {
        // Match Found!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlipped.includes(c.id) ? { ...c, isMatched: true } : c
          ));
          setFlippedIds([]);
        }, 500);
      } else {
        // No Match - Flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedIds([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setIsWon(true);
    }
  }, [cards]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-6">
        <h3 className="font-bold text-gray-700">Mindful Memory</h3>
        <button onClick={resetGame} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500 hover:bg-gray-200">Restart</button>
      </div>

      {isWon ? (
        <div className="text-center py-10 animate-fade-in">
            <h2 className="text-2xl font-bold text-serenova-primary mb-2">Tranquility Found 🌿</h2>
            <button onClick={resetGame} className="bg-serenova-dark text-white px-6 py-2 rounded-xl mt-4">Play Again</button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
          {cards.map((card) => {
            const Icon = ICONS[card.iconId];
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-xl flex items-center justify-center text-white text-2xl transition-all duration-500 transform ${
                  card.isFlipped || card.isMatched 
                    ? 'bg-serenova-primary rotate-0' 
                    : 'bg-serenova-bg rotate-y-180 hover:bg-serenova-secondary'
                }`}
              >
                {(card.isFlipped || card.isMatched) && <Icon size={28} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}