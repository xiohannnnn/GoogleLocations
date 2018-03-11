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
// Main Map Function(s)
// - - - - - - - - - //
let marker_positions = [];  // So there aren't multiple markers in the same place

function initMap() {
  console.log("Initialising map");
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(
    document.getElementById("map"),
    {
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 2,
      mapTypeId: "hybrid"
    }
  );
  console.log("Map ready");
}


// - - - - - - - - - //
// Utility Function(s)
// - - - - - - - - - //
function search() {
  let address = document.getElementById("searchBox").value;
  console.log("Searching for " + address);
  if (address != "") {
    geocoder.geocode({
        "address": address,
        componentRestrictions: {country: "UK"}
      },
      function (results, status) {
        if (status == "OK") {
          let loc = results[0].geometry.location
          map.panTo(loc);
        } else {
          alert("Cannot perform search, reason: " + status);
        }
    });
  }
}

function createMarker(lat, lng) {
  let current_lat_lng = lat.toString() + lng.toString();
  if (marker_positions.includes(current_lat_lng)) {
    // Do nothing, dont need multiple markers in one place
  } else {
    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        icon: "res/redDot.png"
    });
    marker_positions.push(current_lat_lng);
  }
}

function getUserLoc() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locSuccessCallback, locErrorCallback);
  }
}

function locSuccessCallback(position) {
  let new_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  map.panTo(new_location);
}

function locErrorCallback(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("Denied request for Geolocation");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Your location information is unavailable");
      break;
    case error.TIMEOUT:
      alert("The request to get your location timed out");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error in finding your location occurred");
      break;
  }
}
