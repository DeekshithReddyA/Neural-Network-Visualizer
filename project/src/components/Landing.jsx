import React, { useState, useRef } from 'react';
import { NetworkForm } from './NetworkForm';
import DatasetForm from './DatasetForm';
import NetworkVisualization from './NetworkVisualization';
import axios from 'axios';
import LossHistory from './LossHistory';

function Landing() {
  const [dataset, setDataset] = useState({ name: "spiral", inputLayer: 2, outputLayer: 3 });
  const [activation, setActivation] = useState({ activation: "Sigmoid" });
  const [isActSelected, setIsActSelected] = useState(false);
  const [layers, setLayers] = useState([
    { id: crypto.randomUUID(), neurons: 2 }, // Input layer
    { id: crypto.randomUUID(), neurons: 4 }, // Hidden layer
    { id: crypto.randomUUID(), neurons: 3 } // Output Layer
  ]);
  const [networkConfig, setNetworkConfig] = useState({ layers });
  const [data, setData] = useState({ dataset, activation, layers });
  const [lossResponse, setLossResponse] = useState({ metric_name: '', loss: '' });
  const [epochsLr, setEpochsLr] = useState({ epochs: 100, lr: 0.001 });

  const visulizationRef = useRef(null);

  const handleGenerateNetwork = async () => {
    await setNetworkConfig({ layers });
    if (visulizationRef.current) {
      visulizationRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setData({ dataset, activation, layers, epochsLr });
    console.log(data);
  };

  const handleTrainNetwork = async () => {
    const updatedData = {
      dataset,
      activation,
      layers,
      epochsLr,
    };
    setData(updatedData);
    const response = await axios.post('https://neural-network-visualizer.onrender.com/train', updatedData);
    setLossResponse({ metric_name: response.data.metric_name, loss: response.data.loss });
    console.log(response.data);
  };

  return (
    <>

    <header className="bg-indigo-600 text-white py-6 shadow-lg">
      <h1 className="text-3xl font-bold text-center">Neural Network Visualizer</h1>
    </header>
      <div className="min-h-screen bg-gray-50">
  <div className="container mx-auto px-4 py-4">
    {/* Flexbox container for DatasetForm, LossHistory, and NetworkForm */}
    <div className="flex gap-4">
      {/* Left section with DatasetForm and NetworkForm */}
      <div className="w-2/3 flex gap-3 flex-col">
        {/* DatasetForm */}
        <DatasetForm
          onDatasetChange={setDataset}
          onLayerChange={setLayers}
        />

        {/* NetworkForm directly below DatasetForm */}
        <NetworkForm
          layers={layers}
          onLayersChange={setLayers}
          onGenerateNetwork={handleGenerateNetwork}
          onDatasetChange={setDataset}
          onEpochsLrChange={setEpochsLr}
          epochsLr={epochsLr}
          onTrainNetwork={handleTrainNetwork}
        />
      </div>

      {/* LossHistory positioned right next to DatasetForm and NetworkForm */}
      <div className="w-1/3 h-[550px] ">
        <LossHistory lossResponse={lossResponse} />
      </div>
    </div>

    {/* NetworkVisualization below everything */}
    <div
      className="bg-white p-6 rounded-lg shadow-lg mt-4"
      style={{ height: '600px' }}
      ref={visulizationRef}
    >
      <NetworkVisualization config={networkConfig} />
    </div>
  </div>
</div>

    </>
  );
}

export default Landing;