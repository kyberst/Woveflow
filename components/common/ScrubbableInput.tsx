import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../hooks/useEditor';

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function ScrubbableInput({ value, onChange, className, placeholder }: Props) {
  const { dispatch } = useEditor();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to parse value and unit
  const parseValue = (val: string) => {
    const match = val.match(/^(-?[\d.]+)(.*)$/);
    if (match) {
      return { num: parseFloat(match[1]), unit: match[2] || 'px' };
    }
    return { num: 0, unit: 'px' };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only trigger scrub if clicking directly, not if user is trying to focus text
    // A common UX pattern is holding a modifier key or cursor check, 
    // but for this UI, we'll assume cursor-ew-resize indicates scrub area.
    if ((e.target as HTMLElement).style.cursor !== 'ew-resize') return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const startX = e.clientX;
    const { num: startVal, unit } = parseValue(value);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      // Holding Shift speeds up, Alt slows down (optional, simplified here)
      const step = 1; 
      const newValue = Math.round(startVal + delta * step);
      onChange(`${newValue}${unit}`);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dispatch({ type: 'ADD_HISTORY' }); // Commit change on release
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    dispatch({ type: 'ADD_HISTORY' });
  };

  // Determine if the value is empty or generic
  const displayValue = value === '' ? '-' : value;

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      className={`bg-transparent text-center border-none focus:ring-0 p-0 w-full cursor-ew-resize focus:cursor-text text-xs ${className}`}
      placeholder={placeholder}
      onDoubleClick={(e) => {
        // Allow text selection on double click by changing cursor context or stopping propagation if needed
        (e.target as HTMLInputElement).select();
      }}
    />
  );
}