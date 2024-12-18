import './App.css';
import React, { useState, useRef } from 'react';
import { NetworkForm } from './components/NetworkForm';
import DatasetForm from './components/DatasetForm';
import NetworkVisualization from './components/NetworkVisualization';
import axios from 'axios';
import LossHistory from './components/LossHistory';
import Activation from './components/Activation';

function App() {
  const [dataset, setDataset] = useState({ name: "spiral", inputLayer: 2, outputLayer: 3 });
  const [activation, setActivation] = useState({ activation: "Sigmoid" });
  const [isDatasetSelected, setIsDatasetSelected] = useState(false);
  const [isActSelected, setIsActSelected] = useState(false);
  const [layers, setLayers] = useState([]);
  const [networkConfig, setNetworkConfig] = useState({ layers });
  const [data, setData] = useState({ dataset, activation, layers });
  const [lossResponse, setLossResponse] = useState("");

  const visulizationRef = useRef(null);

  const handleGenerateNetwork = async () => {
    await setNetworkConfig({ layers });
    if (visulizationRef.current) {
      visulizationRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setData({ dataset, activation, layers });
    console.log(data)
  };

  const handleTrainNetwork = async () => {
    setData({ dataset, activation, layers });
    const response = await axios.post('http://localhost:5000/train', data);
    setLossResponse(response.data.loss);
    console.log(response.data.loss);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex px-4 gap-4">
            <div className="w-1/2 gap-8 py-4">
              <DatasetForm
                onDatasetChange={setDataset}
                onLayerChange={setLayers}
                isDatasetSelected={setIsDatasetSelected}
              />
            </div>
            <div className="w-1/2 gap-8 py-4">
              <Activation
                onActChange={setActivation} 
                isActSelected={isActSelected}
                setIsActSelected={setIsActSelected}
                isDatasetSelected={isDatasetSelected}
              />
            </div>
          </div>
          <div className="flex gap-4 py-2">
            <div className="w-1/2">
              {/* NetworkForm takes 50% of the width */}
              <NetworkForm
                layers={layers}
                onLayersChange={setLayers}
                onGenerateNetwork={handleGenerateNetwork}
                onDatasetChange={setDataset}
                isDatasetSelected={isDatasetSelected}
                onTrainNetwork={handleTrainNetwork}
              />
            </div>

            <div className="w-1/3 h-[400px] overflow-y-auto">
              {/* LossHistory takes 1/3 of the width */}
              <LossHistory lossResponse={lossResponse} />
            </div>
          </div>

          <div
            className="bg-white p-6 rounded-lg shadow-lg"
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

export default App;




// import './App.css';
// import React, { useState ,useRef } from 'react';
// import { NetworkForm } from './components/NetworkForm';
// import DatasetForm from './components/DatasetForm';
// import NetworkVisualization from './components/NetworkVisualization';
// import axios from 'axios';
// import LossHistory from './components/LossHistory';
// import Activation from './components/Activation';
// // import { Sidebar } from './components/Sidebar';
// function App() {
//   const [dataset, setDataset] = useState({ name: "spiral", inputLayer: 2, outputLayer: 3 });
//   const [activation, setActivation] = useState({ activation: "Sigmoid"});
//   const [isDatasetSelected , setIsDatasetSelected] = useState(false);
//   const [isActSelected , setIsActSelected] = useState(false);
//   const [layers, setLayers] = useState([]);
//   const [networkConfig, setNetworkConfig] = useState({ layers });
//   const [data , setData] = useState({dataset , networkConfig});
//   const [lossResponse , setLossResponse] = useState("")  
  
//   const visulizationRef = useRef(null);


//   const handleGenerateNetwork = async () => {
//     await setNetworkConfig({ layers });
    
//     if(visulizationRef.current){
//       visulizationRef.current.scrollIntoView({behavior: "smooth"})
//     }
//     setData({dataset , layers});
//   }

//   const handleTrainNetwork = async () => {
//     const response = await axios.post('http://localhost:5000/train', data)
//     setLossResponse(response.data.loss)
//     console.log(response.data.loss);
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//         <div className='flex px-4 gap-4'>
//           <div className="w-1/2 gap-8 py-4">
//             <DatasetForm
//               onDatasetChange={setDataset}
//               onLayerChange={setLayers}
//               isDatasetSelected={setIsDatasetSelected}
//               />
//           </div>
//           <div className="w-1/2 gap-8 py-4">
//             <Activation
//               onActChange={setActivation}
//               isActSelected={setIsActSelected}
//               isDatasetSelected={setIsDatasetSelected}
//             />
//           </div>
//           </div>
//           <div className="flex gap-4 py-2">
//             <div className="w-1/2"> {/* NetworkForm takes 50% of the width */}
//               <NetworkForm
//                 layers={layers}
//                 onLayersChange={setLayers}
//                 onGenerateNetwork={handleGenerateNetwork}
//                 onDatasetChange={setDataset}
//                 isDatasetSelected={isDatasetSelected}
//                 onTrainNetwork={handleTrainNetwork}
//               />
//             </div>
  
//             <div className="w-1/3 h-[400px] overflow-y-auto"> {/* LossHistory takes 1/3 of the width */}
//               <LossHistory lossResponse={lossResponse} />
//             </div>
//           </div>
  
//           <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '600px' }} ref={visulizationRef}>
//             <NetworkVisualization config={networkConfig} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
  

  
// }

// export default App;
// // return (
// //     <>
// //       <div className="min-h-screen bg-gray-50">
// //         <div className="container mx-auto px-4 py-8">

// //             <div className="flex flex-col gap-8 py-4">
// //             {/* <Sidebar /> */}
// //             <DatasetForm onDatasetChange={setDataset}
// //               onLayerChange={setLayers} 
// //               isDatasetSelected={setIsDatasetSelected}/>
// //             </div>

// //           <div className='flex gap-4 py-2'>
// //             <div className='col-auto h-auto'>
// //             <NetworkForm
// //               layers={layers}
// //               onLayersChange={setLayers}
// //               onGenerateNetwork={handleGenerateNetwork}
// //               onDatasetChange={setDataset}
// //               isDatasetSelected={isDatasetSelected}
// //               onTrainNetwork={handleTrainNetwork}

// //             />
// //             </div>
// //             <div className="w-1/2"> {/* LossHistory takes 1/3 of the width */}
// //             <LossHistory lossResponse={lossResponse} />
// //             </div>
// //           </div>
// //             <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '600px' }} ref={visulizationRef}>
// //               <NetworkVisualization config={networkConfig } />
// //             </div>
// //         </div>
// //       </div>
// //     </>

// //   );