import './App.css';
import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { sample } from '@turf/turf'

const randomPositionInPolygon = require('random-position-in-polygon');
const countries = require('@geo-maps/countries-coastline-100m')()

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Game />
      </header>
    </div>
  );
}

const containerStyle = {
  width: '1000px',
  height: '800px'
};

function getRandomCenter() {
  const chosen_country = sample(countries, 1).features[0]
  // const all_countries = combine(countries);
  console.log(chosen_country.properties.A3)
  const point = randomPositionInPolygon(chosen_country);
  const coords = {
    lat: point[1],
    lng: point[0]
  }
  console.log("new center", coords)
  return coords
}

function Game() {
  const [center,] = React.useState(getRandomCenter())

  return <MapController center={center} />
}

function MapController({ center }) {
  const [zoom, setZoom] = React.useState(15)

  const increment_zoom = (z) => (z > 3) ? z - 0.004 : z

  const start_zooming = () => {
    const interval = setInterval(() => {
      setZoom(increment_zoom)
    }, 50);
    return () => clearInterval(interval);
  }

  return (
    <div>
      <Map center={center} zoom={zoom} onLoad={start_zooming} />
    </div>
  )
}


function Map({ center, zoom, onLoad }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GMAPS_API_KEY
  })

  const options = {
    disableDefaultUI: true,
    mapTypeId: "satellite",
    gestureHandling: "none",
    keyboardShortcuts: false,
    isFractionalZoomEnabled: true,
    tilt: 0,
  }

  return isLoaded ?
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={options}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
    />
    : <></>
}



export default App;
