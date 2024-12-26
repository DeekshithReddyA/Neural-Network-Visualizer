import React, { useState, useEffect } from 'react'
import { ChartLine } from 'lucide-react'

function LossHistory({lossResponse}) {
    const [lossHistory , setLossHistory] = useState([]);
    useEffect(() =>{
        if (lossResponse) {
          setLossHistory(prevResp=>[...prevResp,
            lossResponse]);
        }
    },[lossResponse])

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <ChartLine className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Loss History</h2>
        </div>
  
        <div className="mt-6 gap-4 max-h-[420px] overflow-y-auto">
          {/* This div will make the loss history scrollable when the content exceeds the height */}
          {lossHistory.map((obj, ind) => (
            <p key={ind} className="text-gray-600">
              {obj.metric_name} {obj.loss == '' ? '' : `${ind - 1}:` } {obj.loss}
            </p>
          ))}
        </div>
      </div>
    );
  
 
}

export default LossHistory
//  return (
//     <div className='bg-white p-6 rounded-lg shadow-lg max-w-2xl'>
//       <div className='flex items-center gap-2 mb-6'>
//         <ChartLine className="w-6 h-6 text-indigo-600" />
//         <h2 className="text-2xl font-bold text-gray-800">Loss History</h2>
//       </div>
//       <div className='mt-6 gap-4'>
//       {lossHistory.map((loss,ind)=>(
//         <p key={ind} className='text-gray-600'>Loss {ind+1}: {loss}</p>
//         ))}
//       </div>
//     </div> 
//   );