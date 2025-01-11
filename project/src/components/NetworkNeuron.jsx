import React from 'react'
import { Circle , Text } from 'react-konva'

function NetworkNeuron({neuron , NEURON_RADIUS , viewport , animationState }) {
  return (
    <React.Fragment key={neuron.id}>
        <Circle
            x={neuron.position.x}
            y={neuron.position.y}
            radius={NEURON_RADIUS / viewport.scale}
            // ref={neuronRefs.current[neuron.id]}
            // ... existing Circle props
            fill={neuron.isActive ? (animationState.currentPhase === 'forward' ? '#fef08a' : '#fee2e2')
                : '#FFFFFF'
            }
            stroke={neuron.isActive ? '#4f46e5' : '#6b7280'}
            strokeWidth={2 / viewport.scale}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.1}
            shadowEnabled
            className="konva-circle"
        />
        <Text
            x={neuron.position.x - NEURON_RADIUS / viewport.scale}
            y={neuron.position.y - 6 / viewport.scale}
            width={NEURON_RADIUS * 2 / viewport.scale}
            text={neuron.value?.toFixed(2) || '0.00'}
            align="center"
            fontSize={12 / viewport.scale}
            fill="#4f46e5"
        />
    </React.Fragment>
  )
}

export default NetworkNeuron