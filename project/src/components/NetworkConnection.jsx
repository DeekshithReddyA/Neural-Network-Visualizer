import React, { useCallback, useEffect, useState } from 'react'
import { Arrow } from 'react-konva'

export function NetworkConnection({ connection , fromNeuron, toNeuron , animationState , onHover, scale}) {

    const [isHovered , setIsHovered] = useState(false);

    const handleMouseEnter = useCallback((e) => {
    setIsHovered(true);
    const stage = e.target.getStage();
    const position = stage.getPointerPosition();
    onHover({
      x: position.x,
      y: position.y,
      connection,
    });
  }, [connection, fromNeuron, toNeuron, onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHover(null);
  }, [onHover]);

  const getConnectionColor = useCallback(() => {
    if (isHovered) return '#4f46e5';
    // if (!connection.isActive) return '#94a3b8';
    // return animationState.currentPhase === 'forward' ? '#fef08a' : '#fee2e2';
    return connection.isActive ? (animationState.currentPhase === 'forward' ? '#eab308' : '#ef4444') : '#94a3b8'
  }, [connection.isActive, animationState.currentPhase, isHovered]); 

    const getConnectionWidth = useCallback(() => {
    const baseWidth = 0.5 + Math.abs(connection.weight) * 0.5;
    return (isHovered ? baseWidth * 2 : baseWidth) / scale;
  }, [connection.weight, isHovered, scale]);


  return (
        <Arrow
      points={[
        fromNeuron.position.x,
        fromNeuron.position.y,
        toNeuron.position.x,
        toNeuron.position.y
      ]}
      stroke={getConnectionColor()}
      strokeWidth={getConnectionWidth()}
      opacity={connection.isActive || isHovered ? 0.8 : 0.4}
      pointerLength={5 / scale}
      pointerWidth={5 / scale}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      shadowColor="black"
      shadowBlur={isHovered ? 10 : 0}
      shadowOpacity={0.2}
      shadowEnabled={isHovered}
      hitStrokeWidth={20 / scale} // Increase hit area for better hover detection
    />
  )
}
