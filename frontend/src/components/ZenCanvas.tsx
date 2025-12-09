"use client";

import { useRef, useState, useEffect } from 'react';
import { Eraser } from 'lucide-react';

export default function ZenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Set initial canvas background
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#FDF6E3'; // Sand color
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if(canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.beginPath(); // Reset path
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#D6C098'; // Darker sand "rake" mark
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if(ctx) {
            ctx.fillStyle = '#FDF6E3';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-4">
        <h3 className="font-bold text-gray-700">Zen Sand Garden</h3>
        <button onClick={clearCanvas} className="text-gray-400 hover:text-serenova-primary">
            <Eraser size={20} />
        </button>
      </div>
      
      <div className="border-4 border-[#E6D5B8] rounded-xl overflow-hidden cursor-crosshair">
        <canvas
            ref={canvasRef}
            width={300}
            height={300}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onMouseLeave={stopDrawing}
        />
      </div>
      <p className="text-xs text-gray-400 mt-4">Drag your mouse to rake the sand.</p>
    </div>
  );
}