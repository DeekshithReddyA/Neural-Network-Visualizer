import React, { useState } from 'react'
import { Sigma } from 'lucide-react';


export default function Activation({isDatasetSelected,onActChange,setIsActSelected,activation}) {
    const [selectedAct,setSelectedAct] = useState(null);
    const selectActivation = (activation) => {
        onActChange(activation); // Call the parent function with the selected activation
        setIsActSelected(true);
        setSelectedAct(activation.name)
      };
      return(
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
        <Sigma />
        <h2 className="text-2xl font-bold text-gray-800">
          Select Activation Function
        </h2>
        </div>
        {isDatasetSelected ? (
        <div className="mt-6 flex gap-4">
          {[
            { name: "Sigmoid" },
            { name: "ReLU" },
            { name: "SoftMax" },
            { name: "Tanh" },
          ].map((activation) => (
            <button
              key={activation.name}
              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                selectedAct === activation.name
                  ? "bg-gray-400 text-gray-800 cursor-not-allowed" // Disabled state
                  : "text-white  bg-indigo-600 hover:bg-indigo-700" // Enabled state
              }`}
              onClick={() => selectActivation(activation)}
              disabled={selectedAct !== null} // Disable all buttons once one is selected
            >
              {activation.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">
          Please select a dataset to enable activation functions.
        </div>
      )}
        </div>
      )
}



// return (
//         <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
//           <div className="flex items-center gap-2 mb-6">
//             <Sigma />
//             <h2 className="text-2xl font-bold text-gray-800">
//               Select Activation Function
//             </h2>
//           </div>
          
//           {/* Show activation buttons only if dataset is selected */}
//           {isDatasetSelected ? (
//             <div className="mt-6 flex gap-4">
//               <button
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//                 onClick={() => {
//                   selectActivation({ name: "Sigmoid" });
//                 }}
//               >
//                 Sigmoid
//               </button>
//               <button
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//                 onClick={() => {
//                   selectActivation({ name: "ReLU" });
//                 }}
//               >
//                 ReLU
//               </button>
//               <button
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//                 onClick={() => {
//                   selectActivation({ name: "SoftMax" });
//                 }}
//               >
//                 SoftMax
//               </button>
//               <button
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//                 onClick={() => {
//                   selectActivation({ name: "Tanh" });
//                 }}
//               >
//                 Tanh
//               </button>
//             </div>
//           ) : (
//             <div className="text-gray-500">
//               Please select a dataset to enable activation functions.
//             </div>
//           )}
//         </div>
//       );