import React, { useState } from 'react'
import { Database } from 'lucide-react';
import sine from '../assets/sine.svg';
import spiral from '../assets/spiral.svg';

export default function DatasetForm({ onLayerChange, onDatasetChange }) {
  const [selectedDataset, setSelectedDataset] = useState("spiral");
  const selectDataset = (dataset) => {
    onDatasetChange(dataset);
    onLayerChange([
      { id: crypto.randomUUID(), neurons: dataset.inputLayer }, // Input layer
      { id: crypto.randomUUID(), neurons: 4 }, // Hidden layer
      { id: crypto.randomUUID(), neurons: dataset.outputLayer } // Output Layer
    ])
    setSelectedDataset(dataset.name);
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
          { name: "sine", inputLayer: 1, outputLayer: 1 },
        ].map((dataset) => (
          <div key={dataset.name} className="relative group">
            <button
              className={`border border-transparent rounded-md ${selectedDataset === dataset.name
                  ? "opacity-100"
                  : selectedDataset
                    ? "opacity-40 hover:opacity-75"
                    : "opacity-100 hover:opacity-75"
                } transition-all duration-200`}
              onClick={() => selectDataset(dataset)}
            >
              <img
                className={`w-17 h-12 border border-2 border-indigo-600 rounded-md transition-all duration-200 ${selectedDataset === dataset.name
                    ? "brightness-100"
                    : "brightness-90 hover:brightness-110"
                  }`}
                src={dataset.name === 'spiral' ? spiral : sine}
                alt={`${dataset.name} visualization`}
              />
            </button>

            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 
      bg-gray-900 text-white text-s rounded 
      opacity-0 group-hover:opacity-100 
      transition-opacity duration-200 
      whitespace-nowrap z-10">
              {dataset.name.charAt(0).toUpperCase() + dataset.name.slice(1)} dataset
            </div>
          </div>
        ))}






      </div>
    </div>
  )
}

