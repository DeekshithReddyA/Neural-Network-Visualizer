import './App.css';
import React, { useState, useRef } from 'react';
import { NetworkForm } from './components/NetworkForm';
import DatasetForm from './components/DatasetForm';
import NetworkVisualization from './components/NetworkVisualization';
import axios from 'axios';
import LossHistory from './components/LossHistory';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react" 

function App() {
  const [dataset, setDataset] = useState({ name: "spiral", inputLayer: 2, outputLayer: 3 });
  const [activation, setActivation] = useState({ activation: "Sigmoid" });
  const [isDatasetSelected, setIsDatasetSelected] = useState(false);
  const [isActSelected, setIsActSelected] = useState(false);
  const [layers, setLayers] = useState([]);
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
    <SpeedInsights />
    <Analytics />
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
          isDatasetSelected={setIsDatasetSelected}
        />

        {/* NetworkForm directly below DatasetForm without a gap */}
        <NetworkForm
          layers={layers}
          onLayersChange={setLayers}
          onGenerateNetwork={handleGenerateNetwork}
          onDatasetChange={setDataset}
          isDatasetSelected={isDatasetSelected}
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

export default App;



// import './App.css';
// import React, { useState, useRef } from 'react';
// import { NetworkForm } from './components/NetworkForm';
// import DatasetForm from './components/DatasetForm';
// import NetworkVisualization from './components/NetworkVisualization';
// import axios from 'axios';
// import LossHistory from './components/LossHistory';
// import Activation from './components/Activation';

// function App() {
//   const [dataset, setDataset] = useState({ name: "spiral", inputLayer: 2, outputLayer: 3 });
//   const [activation, setActivation] = useState({ activation: "Sigmoid" });
//   const [isDatasetSelected, setIsDatasetSelected] = useState(false);
//   const [isActSelected, setIsActSelected] = useState(false);
//   const [layers, setLayers] = useState([]);
//   const [networkConfig, setNetworkConfig] = useState({ layers });
//   const [data, setData] = useState({ dataset, activation, layers });
//   const [lossResponse, setLossResponse] = useState({metric_name : '' , loss : ''});
//   const [epochsLr, setEpochsLr] = useState({epochs : 100 , lr : 0.001});

//   const visulizationRef = useRef(null);

//   const handleGenerateNetwork = async () => {
//     await setNetworkConfig({ layers });
//     if (visulizationRef.current) {
//       visulizationRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//     setData({ dataset, activation, layers , epochsLr });  
//     console.log(data)
//   };

//   const handleTrainNetwork = async () => {
//     const updatedData = {
//       dataset,
//       activation,
//       layers,
//       epochsLr,
//     };
//     setData(updatedData);
//     const response = await axios.post('http://localhost:5000/train', updatedData);
//     setLossResponse({metric_name : response.data.metric_name , loss: response.data.loss});
//     console.log(response.data);
//   };

//   return (
//     <>
    
    // <header className="bg-indigo-600 text-white py-6 shadow-lg">
    //   <h1 className="text-3xl font-bold text-center">Neural Network Visualizer</h1>
    // </header>
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex px-4 gap-4">
//             <div className="w-1/2 gap-8 py-4">
//               <DatasetForm
//                 onDatasetChange={setDataset}
//                 onLayerChange={setLayers}
//                 isDatasetSelected={setIsDatasetSelected}
//               />
//             </div>
//             {/* <div className="w-1/2 gap-8 py-4">
//               <Activation
//                 onActChange={setActivation} 
//                 isActSelected={isActSelected}
//                 setIsActSelected={setIsActSelected}
//                 isDatasetSelected={isDatasetSelected}
//               />
//             </div> */}
//           </div>
//           <div className="flex gap-4 py-2">
//             <div className="w-1/2">
//               {/* NetworkForm takes 50% of the width */}
//               <NetworkForm
//                 layers={layers}
//                 onLayersChange={setLayers}
//                 onGenerateNetwork={handleGenerateNetwork}
//                 onDatasetChange={setDataset}
//                 isDatasetSelected={isDatasetSelected}
//                 onEpochsLrChange={setEpochsLr}
//                 epochsLr={epochsLr}
//                 onTrainNetwork={handleTrainNetwork}
//               />
//             </div>


//           </div>

//           <div
//             className="bg-white p-6 rounded-lg shadow-lg"
//             style={{ height: '600px' }}
//             ref={visulizationRef}
//           >
//             <NetworkVisualization config={networkConfig} />
//           </div>

//           <div className="py-4 w-1/3 h-[400px] overflow-y-auto">
//               {/* LossHistory takes 1/3 of the width */}
//               <LossHistory lossResponse={lossResponse} />
//           </div>
          
//         </div>

//       </div>
//     </>
//   );
// }

// export default App;




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