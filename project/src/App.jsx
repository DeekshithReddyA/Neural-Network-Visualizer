import React from 'react';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react" 
import Landing from './components/Landing';

function App() {
  return (
    <>
    <SpeedInsights />
    <Analytics />
    <Landing />
    </>
  );
}

export default App;
