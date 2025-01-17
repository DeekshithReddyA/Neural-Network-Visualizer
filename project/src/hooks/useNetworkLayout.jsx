import React, { useCallback } from 'react'
import {calculateNetworkDimensions} from '../utils/scaling';

export function useNetworkLayout(config, networkDimensions , NEURON_RADIUS) {

    const calculatePositions = useCallback(() => {
        const neurons = [];
        const connections = [];
        const layerSpacing = networkDimensions.width / (config.layers.length - 1 || 1);

        config.layers.forEach((layer, layerIndex) => {
            const layerHeight = layer.neurons * (NEURON_RADIUS * 3);
            const startY = (networkDimensions.height - layerHeight) / 2;
            const x = layerIndex * layerSpacing;

            for (let i = 0; i < layer.neurons; i++) {
                const neuronId = `${layerIndex}-${i}`;
                const y = startY + i * (NEURON_RADIUS * 3);

                neurons.push({
                    id: neuronId,
                    layerId: layer.id,
                    position: { x, y },
                    value: 0,
                    gradient: 0,
                    isActive: false
                });

                // Only create connections if this isn't the last layer
                if (layerIndex < config.layers.length - 1) {
                    const nextLayer = config.layers[layerIndex + 1];
                    for (let j = 0; j < nextLayer.neurons; j++) {
                        connections.push({
                            id: `${neuronId}-to-${layerIndex + 1}-${j}`,
                            from: neuronId,
                            to: `${layerIndex + 1}-${j}`,
                            weight: Math.random() * 2 - 1,
                            isActive: false
                        });
                    }
                }
            }
        });
        return { neurons, connections };
    }, [config.layers, networkDimensions]);


    return {
        calculatePositions
      };
}

