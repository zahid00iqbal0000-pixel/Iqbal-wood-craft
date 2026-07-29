import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface ImageZoomModalProps {
  imageUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageUrl, title, isOpen, onClose }) => {
  const [scale, setScale] = useState(1.5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(1.5);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn">
      
      {/* Top Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white">
        <div className="bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800 backdrop-blur-md">
          <span className="text-xs font-serif font-bold text-amber-200 block">{title}</span>
          <span className="text-[10px] text-stone-400 font-mono">Ultra High-Res Woodcraft Carving View</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.min(s + 0.5, 4))}
            className="p-2.5 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-xl text-amber-300 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <button
            onClick={() => setScale(s => Math.max(s - 0.5, 1))}
            className="p-2.5 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-xl text-amber-300 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          <button
            onClick={resetZoom}
            className="p-2.5 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-xl text-amber-300 transition"
            title="Reset Zoom"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 rounded-xl text-stone-200 transition"
            title="Close Zoom"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Draggable Zoom Area */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom Floating Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-stone-900/80 border border-stone-800 px-4 py-1.5 rounded-full text-[11px] text-stone-400 backdrop-blur-md">
        Drag to inspect brass inlays, wood grain, & hand carving finish • Scale: {Math.round(scale * 100)}%
      </div>
    </div>
  );
};
