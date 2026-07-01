import React, { useState, useRef, useMemo } from 'react';
import type { BracketData, Round } from '../types';
import { getConnectors } from '../utils/bracketBuilder';
import { generateConnectorPath, generateOrthogonalConnector } from '../utils/polarLayout';
import { MatchNode } from './MatchNode';
import './CircularBracket.css';

interface CircularBracketProps {
  data: BracketData | null;
  onMatchClick: (matchId: string) => void;
  activeRoundFilter: Round | 'ALL';
}

// Fixed dimensions for the SVG canvas (virtual coordinates)
const CANVAS_SIZE = 2000;
const CENTER_X = CANVAS_SIZE / 2;
const CENTER_Y = CANVAS_SIZE / 2;
const MAX_RADIUS = 850;

export const CircularBracket: React.FC<CircularBracketProps> = ({ 
  data, 
  onMatchClick,
  activeRoundFilter
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Pan & Zoom state
  const [viewBox, setViewBox] = useState({ 
    x: 0, y: 0, width: CANVAS_SIZE, height: CANVAS_SIZE 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate connectors once when data changes
  const connectors = useMemo(() => {
    if (!data) return [];
    return getConnectors(data.nodes);
  }, [data]);

  // Handle zooming via mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    
    // Zoom limits
    const newWidth = Math.max(400, Math.min(CANVAS_SIZE * 2, viewBox.width * zoomFactor));
    const newHeight = Math.max(400, Math.min(CANVAS_SIZE * 2, viewBox.height * zoomFactor));
    
    // Calculate new x,y to zoom in on mouse position rather than top-left
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const rx = mouseX / rect.width;
      const ry = mouseY / rect.height;
      
      const newX = viewBox.x + (viewBox.width - newWidth) * rx;
      const newY = viewBox.y + (viewBox.height - newHeight) * ry;

      setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
    }
  };

  // Handle panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate distance moved in screen pixels
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Convert to SVG viewBox units
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = viewBox.width / rect.width;
      const scaleY = viewBox.height / rect.height;
      
      setViewBox(prev => ({
        ...prev,
        x: prev.x - dx * scaleX,
        y: prev.y - dy * scaleY
      }));
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!data) return null;

  return (
    <div className="bracket-viewport">
      <svg
        ref={svgRef}
        className={`bracket-svg ${isDragging ? 'is-dragging' : ''}`}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g className="background-rings-layer">
          {[0, 1, 2, 3].map(ringIndex => {
            const radius = MAX_RADIUS - ringIndex * (MAX_RADIUS / 4);
            return (
              <circle 
                key={`bg-ring-${ringIndex}`} 
                cx={CENTER_X} 
                cy={CENTER_Y} 
                r={radius} 
                className="background-ring" 
              />
            );
          })}
        </g>
        
        <g className="connectors-layer">
          {connectors.map((c, i) => {
            const isDimmed = activeRoundFilter !== 'ALL' && 
                             activeRoundFilter !== c.from.match.round &&
                             activeRoundFilter !== c.to.match.round;
            
            // If the child match has a winner, the team advances along this exact line to the parent
            const isActualWinner = !!c.from.match.winner;

            return (
              <path
                key={`connector-${i}`}
                className={`connector-line ${isDimmed ? 'is-dimmed' : ''} ${isActualWinner ? 'is-active' : ''}`}
                d={generateOrthogonalConnector(c.from, c.to, CENTER_X, CENTER_Y)}
              />
            );
          })}
        </g>
        
        <g className="nodes-layer">
          {Object.values(data.nodes).map(node => (
            <MatchNode
              key={node.match.id}
              node={node}
              onClick={onMatchClick}
              isDimmed={activeRoundFilter !== 'ALL' && node.match.round !== activeRoundFilter}
            />
          ))}
        </g>
      </svg>
      
      {/* Zoom Controls Overlay */}
      <div className="zoom-controls">
        <button 
          onClick={() => setViewBox(prev => ({...prev, width: prev.width * 0.8, height: prev.height * 0.8}))}
          className="glass-panel zoom-btn"
          title="Zoom In"
        >
          +
        </button>
        <button 
          onClick={() => setViewBox({x: 0, y: 0, width: CANVAS_SIZE, height: CANVAS_SIZE})}
          className="glass-panel zoom-btn"
          title="Reset View"
        >
          ⌂
        </button>
        <button 
          onClick={() => setViewBox(prev => ({...prev, width: prev.width * 1.2, height: prev.height * 1.2}))}
          className="glass-panel zoom-btn"
          title="Zoom Out"
        >
          -
        </button>
      </div>
    </div>
  );
};
