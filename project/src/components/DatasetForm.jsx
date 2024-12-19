import React, { useState } from 'react'
import { Database } from 'lucide-react';

export default function DatasetForm({ onLayerChange, onDatasetChange, isDatasetSelected }) {
  const [selectedDataset,setSelectedDataset] = useState(null);
  const selectDataset = (dataset) => {
    onDatasetChange(dataset);
    onLayerChange([
      { id: crypto.randomUUID(), neurons: dataset.inputLayer }, // Input layer
      { id: crypto.randomUUID(), neurons: 4 }, // Hidden layer
      { id: crypto.randomUUID(), neurons: dataset.outputLayer } // Output Layer
    ])
    setSelectedDataset(dataset.name);
    isDatasetSelected(true);
  }
  return (
    <div className='bg-white p-6 rounded-lg shadow-lg max-w-2xl'>
      <div className='flex items-center gap-2 mb-6'>
        <Database className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Select Dataset</h2>
      </div>
      <div className="mt-6 flex gap-4">
        {[
          { name: "spiral", inputLayer: 2, outputLayer: 3 },
          { name: "iris", inputLayer: 4, outputLayer: 1 },
          { name: "xor", inputLayer: 2, outputLayer: 1 },
          { name: "sin", inputLayer: 1, outputLayer: 1 },
        ].map((dataset) => (
          <button
            key={dataset.name}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              selectedDataset === dataset.name
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white`}
            disabled={selectedDataset !== null && selectedDataset !== dataset.name}
            onClick={() => selectDataset(dataset)}
          >
            {dataset.name.charAt(0).toUpperCase() + dataset.name.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

