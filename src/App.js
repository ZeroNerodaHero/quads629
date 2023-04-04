import logo from './logo.svg';
import './App.css';
import MapWrapper from "./components/map_component/MapWrapper";
import Overlay from './components/overlay_info/Overlay'
import {useState,useEffect,} from 'react';
import ErrorContext, {AbsolutePrompt} from './components/overlay_info/ErrorContext';

function App() {
  const [ features, setFeatures ] = useState([])
  const [ center, setCenter] = useState([-121.955238,37.354107])
  const [errorObj, setErrorObj] = useState({code:"0"})

  return (
    <div className="App">
      <ErrorContext.Provider value={{errorObj, setErrorObj}}>
        <Overlay />
        <MapWrapper features={features} center={center}/>
        <AbsolutePrompt promptObj={errorObj}/>
      </ErrorContext.Provider>
    </div>
  );
}

export default App;
