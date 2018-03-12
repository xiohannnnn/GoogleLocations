// Before anything else
$("#loading").hide();

console.log(`
--------------------------------------------------------------
Your location information is NOT sent or stored anywhere, all
the processing and calculations happen locally on YOUR machine
--------------------------------------------------------------
`);


// - - - - - - - - - //
// Slider stuff
// - - - - - - - - - //
// Update the accuracySliderValue whenver the slider is changed
let accuracySlider = document.getElementById("accuracySlider");
let accuracySliderOutput = document.getElementById("accuracySliderValue");
accuracySlider.oninput = function() {accuracySliderOutput.innerHTML = this.value;}


// - - - - - - - - - //
// File upload + Parsing + Plotting
// - - - - - - - - - //
function onReaderDone(event){
  console.log("Read done, parsing");
  let data = JSON.parse(event.target.result);
  let divideBy = data.locations.length / 100;

  console.log("Processing lat/long from JSON obj");
  $.each(data.locations, function(key, val) {
    let accuracy = accuracySlider.value;
    let lat = (val.latitudeE7 / 10000000).toFixed(accuracy);
    let lng = (val.longitudeE7 / 10000000).toFixed(accuracy);
    createMarker(lat, lng);
    if (key % 10000 == 0) {
      console.log(Math.round(key / divideBy) + "% processed");
    }
  });

  console.log("100% processed");
  $("#loading").hide();
  marker_positions = null;  // Make marker_positions eligible for garbage collection
  
  console.log("Refresh the page to load another file");
}

document.getElementById("uploadButton").addEventListener("change", (event) => {
  $("#uploadContainer").hide();
  console.log("Using an accuracy of " + accuracySlider.value);
  $("#loading").show();
  console.log("Reading file");
  let reader = new FileReader();
  reader.onload = onReaderDone;
  reader.readAsText(event.target.files[0]);
});


// - - - - - - - - - //
// Map Setup
// - - - - - - - - - //
let marker_positions = [];  // So there aren't multiple markers in the same place

console.log("Initialising map");
map = L.map("map").setView([0, 0], 1);
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoidGhhdGd1eXdpdGh0aGF0bmFtZSIsImEiOiJjamVvanI3MmMwNGN5MndxeGV5bXZmbTV3In0.VIQKn4dusD4Weg2ASQPicQ"
}).addTo(map);
console.log("Map ready");


// - - - - - - - - - //
// Utility Function(s)
// - - - - - - - - - //
function createMarker(lat, lng) {
  let current_lat_lng = lat.toString() + lng.toString();
  if (marker_positions.includes(current_lat_lng)) {
    // Do nothing, dont need multiple markers in one place
  } else {
    let circle = L.circle([lat, lng], {
      color: "red",
      fillOpacity: 1,
      radius: 1
    }).addTo(map);
    marker_positions.push(current_lat_lng);
  }
}
