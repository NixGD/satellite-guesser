import './App.css';
import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { sample } from '@turf/turf'

const randomPositionInPolygon = require('random-position-in-polygon');
const countries = require('@geo-maps/countries-coastline-100m')()

function App() {
  return (
    <div className="App">
      <div className="Border" />
      <header className="App-header">
        <Game />
      </header>
    </div>
  );
}

function getRandomHeading() {
  return Math.floor(Math.random() * 360)
}

const angle = getRandomHeading();
//the CSS currently shows an 800x800 window, so
//we pick dimensions that are 1.5x as large, 
//ie sqrt(2) with a margin of error
const map_dims = 1200;

var zoom_speed = 0.004;

const containerStyle = {
  width: `${map_dims}px`,
  height: `${map_dims}px`,
  transform: `rotate(${angle}deg)`,
  //position in the center of the screen
  position: "absolute",
  left: "50%",
  top: "50%",
  //then move it back by half the width and height
  marginLeft: `-${map_dims/2}px`,
  marginTop: `-${map_dims/2}px`,
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

  const increment_zoom = (z) => (z > 3) ? z - zoom_speed : z

  const start_zooming = () => {
    const interval = setInterval(() => {
      setZoom(increment_zoom);
    }, 50);
    return () => clearInterval(interval);
  }

  // add event listener to toggle zoom_speed variable when space bar is pressed
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        zoom_speed = (zoom_speed === 0) ? 0.004 : 0;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // the map and a link to maps.google.com as a MapsLink css object
  return (
    <div>
      <Map center={center} zoom={zoom} onLoad={start_zooming} />
      <div className="MapsLink">
        <a href={`https://www.google.com/maps/@${center['lat']},${center['lng']},15z/data=!3m1!1e3`}>link</a>
      </div>
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
