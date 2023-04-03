import logo from './logo.svg';
import './App.css';
import MapWrapper from "./components/map_component/MapWrapper";
import Overlay from './components/overlay_info/Overlay'
import {useState,useEffect} from 'react';

function App() {
  const [ features, setFeatures ] = useState([])
  const [ center, setCenter] = useState([-121.955238,37.354107])

  return (
    <div className="App">
      <Overlay />
      <MapWrapper features={features} center={center}/>
    </div>
  );
}

export default App;
