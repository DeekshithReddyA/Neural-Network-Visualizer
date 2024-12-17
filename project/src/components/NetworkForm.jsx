import { Plus, Minus, Brain } from 'lucide-react';
import { useState } from 'react';


export function NetworkForm({ layers, onLayersChange, onGenerateNetwork ,  isDatasetSelected , onTrainNetwork}) {

  const [isNetworkGenerated , setIsNetworkGenerated] = useState(false); 
  // const [isDatasetSelected , setIsDatasetSelected] = useState(false);

  const addLayer = () => {
    const outputLayer = layers[layers.length - 1];

    onLayersChange([
      ...layers.slice(0 , -1),
      { id: crypto.randomUUID(), neurons: 1 },
      outputLayer
    ]);
  };

  const removeLayer = (index) => {
    if (layers.length > 2) {
      const newLayers = [...layers];
      newLayers.splice(index, 1);
      onLayersChange(newLayers);
    }
  };

  const updateNeurons = (index, neurons) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], neurons: Math.max(1, neurons) };
    onLayersChange(newLayers);
  }

  const handleGenerateNetwork = () => {
    onGenerateNetwork();
    setIsNetworkGenerated(true);
  }

  const handleTrainNetwork = () => {
    onTrainNetwork();
  }

  return (<>

    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Neural Network Configuration</h2>
      </div>

      <div className="space-y-4">
        {layers.map((layer, index) => (
          <div key={layer.id} className="flex items-center gap-4">
            <span className="w-24 text-sm font-medium text-gray-700">
              {index === 0 ? 'Input Layer' : index === layers.length - 1 ? 'Output Layer' : `Hidden Layer ${index}`}
            </span>
            <input
              type="number"
              min="1"
              value={layer.neurons}
              onChange={(e) => updateNeurons(index, parseInt(e.target.value))}
              className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={index === 0 || index === layers.length - 1}
            />
            <span className="text-sm text-gray-500">neurons</span>
            {layers.length > 3 && index !== 0 && index !== layers.length - 1 && (
              <button
                onClick={() => removeLayer(index)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <Minus className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={addLayer}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 
          ${isDatasetSelected ? 'bg-indigo-100 hover:bg-indigo-200' : 'bg-gray-400 cursor-not-allowed' }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Hidden Layer
        </button>
        <button
          onClick={handleGenerateNetwork}
          className= {` inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
            ${ isDatasetSelected ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed' } `}
        >
          <Brain className="w-4 h-4 mr-2" />
          Generate Network
        </button>
        <button
            onClick={handleTrainNetwork}
            disabled={!isNetworkGenerated}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              isNetworkGenerated ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <Brain className="w-4 h-4 mr-2" />
            Train Network
          </button>

      </div>
    </div>
  </>
  );
}

