import React from 'react';


export function ConnectionTooltip({ x, y, connection, animationState }) {

  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-lg p-4 text-sm border border-indigo-100"
      style={{
        left: x + 10,
        top: y + 10,
        transform: 'translate(0, -50%)',
        pointerEvents: 'none',
        minWidth: '200px',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <div className="space-y-2">
        <div className="font-medium text-gray-900 border-b border-gray-100 pb-2">
          Connection Details
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-500">Weight:</div>
          <div className="text-indigo-600 font-medium">
            {connection.weight.toFixed(4)}
          </div>
          <div className="text-gray-500">Phase:</div>
          <div className="text-gray-900 font-medium">
            {animationState.currentPhase === 'forward' ? (
              <span className="text-yellow-600">Forward Pass</span>
            ) : animationState.currentPhase === 'backward' ? (
              <span className="text-red-600">Backward Pass</span>
            ) : (
              <span className="text-gray-500">Inactive</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}