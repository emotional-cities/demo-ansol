import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
//import { Icon } from "leaflet";
import "./App.css";
const opencage = require('opencage-api-client');

//BCN {"lat": 41.38658717375506, "lng": 2.156753540039063}
//NY {"lat": 40.730610, "lng": -73.935242}

const OCD_API_KEY = process.env.REACT_APP_OCD_API_KEY; 

  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        markers: [],
        input: ""
      };
    }

    // Add a marker to the map, by clicking on it
    addMarker = (e) => {
      const {markers} = this.state
      markers.push(e.latlng)
      console.log(e.latlng);
      this.setState({markers})
    }  
    
    updateInput(e) {
      this.setState({
        input: e.target.value
      });
    }


    // Adds marker to map and flies to it with an animation
    addLocation =() =>{
      opencage
        .geocode({ q: this.state.input, key: OCD_API_KEY})
        .then(data => {
          // Found at least one result
          if (data.results.length > 0){
              console.log("Found: " + data.results[0].formatted);
              const latlng = data.results[0].geometry;
              const {markers} = this.state
              markers.push(latlng)
              console.log(latlng);
              this.setState({markers})
              let mapInst =  this.refs.map.leafletElement;
              mapInst.flyTo(latlng, 12);
          } else alert("No results found!!");

        })
        .catch(error => {
          console.log('error', error.message);
        });


    }

  
  render() {

  return (
    <div className="App mt-3">

      <h1 className="mytitle">My Pretty Map</h1>
      <Map ref='map' center={[41.38879, 2.15899]}
        onClick={this.addMarker}
      zoom={15}
      >
        <TileLayer
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
          attribution='&copy; Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
          {this.state.markers.map((position, idx) => 
          <Marker key={`marker-${idx}`} position={position}>
            <Popup>
          <span>Hello world!</span>
            </Popup>
          </Marker>
        )}
      </Map>
      <br></br>
      <div className="container">
      <div className="form-inline mb-3">
          <input
            className="form-control flex-primary-1"
            onChange={e => this.updateInput(e)}
            value={this.state.input}
          />

          <button
            className="btn btn-primary ml-2"
            onClick={e => this.addLocation()}
          >
            Submit your location
          </button>
        </div>
        </div>

    </div>
  );
}

  }

export default App;