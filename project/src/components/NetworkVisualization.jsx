import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { calculateNetworkDimensions, calculateInitialScale, clampScale } from '../utils/scaling';
import { Stage, Layer, Circle, Arrow, Text } from 'react-konva';
import useMeasure from 'react-use-measure';
import { generateRandomWeights, generateRandomValues } from '../utils/animations';
import ZoomControls from './ZoomControls';
import AnimationControls from './AnimationControls';
import { useNetworkLayout } from '../hooks/useNetworkLayout';
import { NetworkConnection } from './NetworkConnection';
import NetworkNeuron from './NetworkNeuron';
import { ConnectionTooltip } from './ConnectionToolTip';

function NetworkVisualization({ config }) {

    // for animations state
    const neuronRefs = useRef({});
    const connectionRefs = useRef({});

    //For tooltip
    const [tooltipData, setTooltipData] = useState(null);


    const [neurons, setNeurons] = useState([]);
    const [connections, setConnections] = useState([]);
    // For viewport
    const [viewport, setViewport] = useState({ scale: 1, x: 0, y: 0 });
    const [ref, bounds] = useMeasure();
    const stageRef = useRef(null);
    //For dragging
    const isDragginRef = useRef(false);
    

    //For animations
    const [animationState, setAnimationState] = useState({
        isPlaying: false,
        currentPhase: 'none',
        currentLayer: 0,
        speed: 1,
        iteration: 0
    })
    const animationFrameRef = useRef();
    const lastUpdateTimeRef = useRef(0);

    const NEURON_RADIUS = 15;


    // Memoize network dimension calculation
    const { maxNeuronsInLayer, networkDimensions } = useMemo(() => {
        const maxNeurons = Math.max(...config.layers.map(layer => layer.neurons));
        return {
            maxNeuronsInLayer: maxNeurons,
            networkDimensions: calculateNetworkDimensions(
                config.layers.length,
                maxNeurons,
                bounds.width || 800,
                bounds.height || 600
            )
        };
    }, [config.layers, bounds.width, bounds.height]);

    const { calculatePositions } = useNetworkLayout(config, networkDimensions, NEURON_RADIUS);
    //Reset animation when config changes
    useEffect(() => {
        setAnimationState({
            isPlaying: false,
            currentPhase: 'none',
            currentLayer: 0,
            speed: 1,
            iteration: 0
        });
    }, [config]);




    useEffect(() => {
        if (bounds.width && bounds.height) {
            const { neurons: calculatedNeurons, connections: calculatedConnections } = calculatePositions();
            const randomizedNeurons = generateRandomValues(calculatedNeurons);
            const randomizedConnections = generateRandomWeights(calculatedConnections);

            setNeurons(randomizedNeurons);
            setConnections(randomizedConnections);

            const initialScale = calculateInitialScale(networkDimensions, bounds);
            setViewport({
                scale: initialScale,
                x: (bounds.width - networkDimensions.width * initialScale) / 2,
                y: (bounds.height - networkDimensions.height * initialScale) / 2
            });
        }
    }, [config, calculatePositions, bounds, networkDimensions]);

    // Update refs when neurons and connections change
    useEffect(() => {
        // Create or update refs for neurons
        neurons.forEach(neuron => {
            if (!neuronRefs.current[neuron.id]) {
                neuronRefs.current[neuron.id] = React.createRef();
            }
        });

        // Create or update refs for connections
        connections.forEach(conn => {
            if (!connectionRefs.current[conn.id]) {
                connectionRefs.current[conn.id] = React.createRef();
            }
        });
    }, [neurons, connections]);


    //Updating Active neurons and connections based on animations
    useEffect(() => {
        if (animationState.currentPhase === 'none') {
            // Reset all neurons and connections without animation
            setNeurons(prev => prev.map(n => ({ ...n, isActive: false })));
            setConnections(prev => prev.map(conn => ({ ...conn, isActive: false })));
            return;
        }

        const currentLayer = animationState.currentLayer;
        const isForward = animationState.currentPhase === 'forward';

        // Animate neurons
        neurons.forEach(neuron => {
            const [layerIndex] = neuron.id.split('-').map(Number);
            const isActive = isForward
                ? layerIndex === currentLayer
                : layerIndex === config.layers.length - 1 - currentLayer;

            const nodeRef = neuronRefs.current[neuron.id];
            if (nodeRef && nodeRef.current) {
                // Create and play tween
                new Konva.Tween({
                    node: nodeRef.current,
                    duration: 0.3,
                    fill: isActive ? (isForward ? '#fef08a' : '#fee2e2') : '#ffffff',
                    easing: Konva.Easings.EaseInOut
                }).play();
            }
        });

        // Animate connections
        connections.forEach(conn => {
            const [fromLayer] = conn.from.split('-').map(Number);
            const [toLayer] = conn.to.split('-').map(Number);

            const isActive = isForward
                ? fromLayer === currentLayer - 1 && toLayer === currentLayer
                : fromLayer === config.layers.length - 2 - currentLayer && toLayer === config.layers.length - 1 - currentLayer;

            const nodeRef = connectionRefs.current[conn.id];
            if (nodeRef && nodeRef.current) {
                // Create and play tween
                new Konva.Tween({
                    node: nodeRef.current,
                    duration: 0.3,
                    stroke: isActive ? (isForward ? '#eab308' : '#ef4444') : '#94a3b8',
                    opacity: isActive ? 0.8 : 0.4,
                    easing: Konva.Easings.EaseInOut
                }).play();
            }
        });

        // Update state to reflect active/inactive status
        setNeurons(prev => prev.map(neuron => {
            const [layerIndex] = neuron.id.split('-').map(Number);
            const isActive = isForward
                ? layerIndex === currentLayer
                : layerIndex === config.layers.length - 1 - currentLayer;
            return { ...neuron, isActive };
        }));

        setConnections(prev => prev.map(conn => {
            const [fromLayer] = conn.from.split('-').map(Number);
            const [toLayer] = conn.to.split('-').map(Number);

            const isActive = isForward
                ? fromLayer === currentLayer - 1 && toLayer === currentLayer
                : fromLayer === config.layers.length - 2 - currentLayer && toLayer === config.layers.length - 1 - currentLayer;
            return { ...conn, isActive };
        }));
    }, [animationState.currentPhase, animationState.currentLayer, config.layers.length]);



    const handlePlay = useCallback(() => {
        setAnimationState(prev => ({
            ...prev,
            isPlaying: true,
            currentPhase: 'forward',
            currentLayer: 0
        }));
    }, []);

    const handlePause = useCallback(() => {
        setAnimationState(prev => ({
            ...prev,
            isPlaying: false,
        }));
    }, []);

    const handleReset = useCallback(() => {
        setAnimationState({
            isPlaying: false,
            currentPhase: 'none',
            currentLayer: 0,
            speed: 1,
            iteration: 0
        });

        const { neurons: newNeurons, connections: newConnections } = calculatePositions();
        setNeurons(generateRandomValues(newNeurons));
        setConnections(generateRandomWeights(newConnections));
        setTooltipData(null);
    }, [calculatePositions]);

    const handleStepForward = useCallback(() => {
        setAnimationState(prev => {
            const nextLayer = prev.currentLayer + 1;
            const isForwardComplete = nextLayer >= config.layers.length;
            const isBackwardComplete = prev.currentPhase === 'backward' && nextLayer >= config.layers.length;

            if (isBackwardComplete) {
                return {
                    ...prev,
                    currentPhase: 'forward',
                    currentLayer: 0,
                    iteration: prev.iteration + 1
                };
            }
            if (isForwardComplete) {
                return {
                    ...prev,
                    currentPhase: 'backward',
                    currentLayer: 0
                }
            }

            return {
                ...prev,
                currentLayer: nextLayer
            };
        });
    }, [config.layers.length]);



    useEffect(() => {
        if (animationState.isPlaying) {
            const animate = (timestamp) => {
                if (!lastUpdateTimeRef.current) lastUpdateTimeRef.current = timestamp;

                const deltaTime = timestamp - lastUpdateTimeRef.current;
                const frameTime = (1000 / animationState.speed);

                if (deltaTime >= frameTime) {
                    handleStepForward();
                    lastUpdateTimeRef.current = timestamp;
                }

                animationFrameRef.current = requestAnimationFrame(animate);
            };

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [animationState.isPlaying, animationState.speed, handleStepForward])

    const handleWheel = useCallback((e) => {
        if (animationState.isPlaying) return;
        e.evt.preventDefault();
        const stage = stageRef.current;
        const oldScale = viewport.scale;
        const pointer = stage.getPointerPosition();
        const mousePointTo = {
            x: (pointer.x - viewport.x) / oldScale,
            y: (pointer.y - viewport.y) / oldScale,
        };

        const newScale = clampScale(oldScale * Math.pow(0.9, e.evt.deltaY / 100));
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        setViewport({ scale: newScale, x: newPos.x, y: newPos.y });
    }, [viewport, animationState.isPlaying])

    const handleDragStart = () => {
        isDragginRef.current = true;
    };

    const handleDragEnd = () => {
        isDragginRef.current = false;
    }

    const handleDragMove = (e) => {
        if (animationState.isPlaying) return;
        setViewport(prev => ({
            ...prev,
            x: e.target.x(),
            y: e.target.y()
        }));
    };

    // const getConnectionColor = useCallback((connection) => {
    //     if (!connection.isActive) return '#94a3b8';
    //     // return animationState.currentPhase === 'forward' ? '#eab308' : '#ef4444';
    //     if (animationState.currentPhase === 'forward') {
    //         return connection.isActive ? '#eab308' : '#94a3b8';
    //     } else if (animationState.currentPhase === 'backward') {
    //         return connection.isActive ? '#ef4444' : '#94a3b8';
    //     }
    //     return '#94a3b8';
    // }, [animationState.currentPhase]);

    // const getNeuronColor = useCallback((neuron) => {
    //     if (!neuron.isActive) return '#ffffff';
    //     // return animationState.currentPhase === 'forward' ? '#fef08a' : '#fee2e2';

    //     if (animationState.currentPhase === 'forward') {
    //         return neuron.isActive ? '#fef08a' : '#ffffff';
    //     } else if (animationState.currentPhase === 'backward') {
    //         return neuron.isActive ? '#fee2e2' : '#ffffff';
    //     }
    //     return '#ffffff';

    // }, [animationState.currentPhase]);

    if (!bounds.width || !bounds.height) {
        return <div ref={ref} className="w-full h-full" />;
    }

    // For debugging
    // console.log('Neurons:', neurons);
    // console.log('Connections:', connections);

    return (
        <div ref={ref} className="w-full h-full relative">
            <Stage
                ref={stageRef}
                width={bounds.width}
                height={bounds.height}
                onWheel={handleWheel}
                draggable={!animationState.isPlaying}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
                x={viewport.x}
                y={viewport.y}
                scale={{ x: viewport.scale, y: viewport.scale }}
            >
                <Layer>
                    {/* Render connections first so they appear behind neurons */}
                    {connections.map((conn) => {
                        const fromNeuron = neurons.find(n => n.id === conn.from);
                        const toNeuron = neurons.find(n => n.id === conn.to);

                        if (!fromNeuron || !toNeuron) {
                            console.warn('Missing neuron for connection:', conn);
                            return null;
                        }

                        return (
                            <NetworkConnection
                                key={`${conn.from}-${conn.to}`}
                                connection={conn}
                                fromNeuron={fromNeuron}
                                toNeuron={toNeuron}
                                animationState={animationState} 
                                onHover={setTooltipData}
                                scale={viewport.scale}/>
                            // <Arrow
                            //     key={conn.id}
                            //     points={[
                            //         fromNeuron.position.x,
                            //         fromNeuron.position.y,
                            //         toNeuron.position.x,
                            //         toNeuron.position.y
                            //     ]}
                            //     ref={connectionRefs.current[conn.id]}
                            //     // ... existing Arrow props
                                // stroke={conn.isActive
                                //     ? (animationState.currentPhase === 'forward' ? '#eab308' : '#ef4444')
                                //     : '#94a3b8'
                            //     }
                            //     listening={false}
                            //     strokeWidth={1 + Math.abs(conn.weight)}
                            //     opacity={conn.isActive ? 0.8 : 0.4}
                            //     pointerLength={5}
                            //     pointerWidth={5}
                            //     tension={0.2}
                            //     className="konva-arrow"
                            // />
                        );
                    })}

                    {/* Render neurons */}
                    {neurons.map((neuron) => (
                        <NetworkNeuron
                            key={neuron.id}
                            neuron={neuron}
                            NEURON_RADIUS={NEURON_RADIUS}
                            viewport={viewport}
                            animationState={animationState} />
                        // <React.Fragment key={neuron.id}>
                        //     <Circle
                        //         x={neuron.position.x}
                        //         y={neuron.position.y}
                        //         radius={NEURON_RADIUS / viewport.scale}
                        //         ref={neuronRefs.current[neuron.id]}
                        //         // ... existing Circle props
                        //         fill={neuron.isActive
                        //             ? (animationState.currentPhase === 'forward' ? '#fef08a' : '#fee2e2')
                        //             : '#6dbeed'
                        //         }
                        //         stroke={neuron.isActive ? '#4f46e5' : '#6b7280'}
                        //         strokeWidth={2 / viewport.scale}
                        //         shadowColor="black"
                        //         shadowBlur={5}
                        //         shadowOpacity={0.1}
                        //         shadowEnabled
                        //         className="konva-circle"
                        //     />
                        //     <Text
                        //         x={neuron.position.x - NEURON_RADIUS / viewport.scale}
                        //         y={neuron.position.y - 6 / viewport.scale}
                        //         width={NEURON_RADIUS * 2 / viewport.scale}
                        //         // text={neuron.value?.toFixed(2) || '0.00'}
                        //         align="center"
                        //         fontSize={12 / viewport.scale}
                        //         fill="#4f46e5"
                        //     />
                        // </React.Fragment>
                    ))}
                </Layer>
            </Stage>
            {tooltipData && (
                <ConnectionTooltip
                    x={tooltipData.x}
                    y={tooltipData.y}
                    connection={tooltipData.connection}
                    animationState={animationState}
                />
            )}
            <AnimationControls
                state={animationState}
                onPlay={handlePlay}
                onPause={handlePause}
                onSpeedChange={(speed) => setAnimationState(prev => ({ ...prev, speed }))}
            />
            <ZoomControls onZoomIn={() => setViewport(prev => ({ ...prev, scale: clampScale(prev.scale * 1.2) }))}
                onZoomOut={() => setViewport(prev => ({ ...prev, scale: clampScale(prev.scale / 1.2) }))}
                onReset={() => {
                    const initialScale = calculateInitialScale(networkDimensions, bounds);
                    setViewport({
                        scale: initialScale,
                        x: (bounds.width - networkDimensions.width * initialScale) / 2,
                        y: (bounds.height - networkDimensions.height * initialScale) / 2
                    });
                }}
                scale={viewport.scale}
            />
        </div>
    );
}

export default NetworkVisualization;