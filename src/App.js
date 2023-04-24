import './App.css';
import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { googleMapsApiKey } from './secrets.js'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <MapController />
      </header>
    </div>
  );
}

const containerStyle = {
  width: '1000px',
  height: '800px'
};

function MapController() {
  const [zoom, setZoom] = React.useState(17)
  // slowly zoom out map
  const zoomOut = () => {
    if (zoom > 0) {
      setZoom(zoom - 0.05);
    }
  }

  // call zoomOut every 2 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      zoomOut();
    }, 100);
    return () => clearInterval(interval);
  });

  // const outlines = bbox("./countries.geojson");
  // console.log(outlines)

  const center = {
    lat: -3.745,
    lng: -38.523
  };
  return (
    <div>
      <Map center={center} zoom={zoom} />
    </div>
  )
}


function Map({ center, zoom }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const options = {
    disableDefaultUI: true,
    mapTypeId: "satellite",
    gestureHandling: "none",
    keyboardShortcuts: false,
    isFractionalZoomEnabled: true,
    center: center,
    zoom: zoom,
    tilt: 0,
  }

  return isLoaded ?
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={options}
    />
    : <></>
}



export default App;
