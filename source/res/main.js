// Before doing anything, hide loading div
$("#loading").hide();

// Let user know they should look at the console
// Probably put this in a closable div at some point
alert(
  `
  /////////// WARNING \\\\\\\\\\\\\\\\\\\\\\
  Performance may drop if you are
  loading hundreds of thousands
  of co-ordinates
  ----------- READ ME -----------
  This website outputs a lot of
  useful information to the
  console, press F12 and then
  select the 'Console' tab to see
  what is going on
  `
);


// - - - - - - - - - //
// Declare Options (make these user editable)
// - - - - - - - - - //

// https://en.wikipedia.org/wiki/Decimal_degrees#Precision
// The less accurate, the less markers, the better the performance when navigating the map
let latLongAccuracy = 5;


// - - - - - - - - - //
// File upload + Parsing + Plotting
// - - - - - - - - - //
function onReaderDone(event){
  console.log("Read done, parsing");
  let data = JSON.parse(event.target.result);
  let divideBy = data.locations.length / 100;

  console.log("Processing lat/long from JSON obj");
  $.each(data.locations, function(key, val) {
    let lat = (val.latitudeE7 / 10000000).toFixed(latLongAccuracy);
    let lng = (val.longitudeE7 / 10000000).toFixed(latLongAccuracy);
    createMarker(lat, lng);
    if (key % 10000 == 0) {
      console.log(Math.round(key / divideBy) + "% processed");
      $('#loadingSpan').html(Math.round(key / divideBy) + "% processed").show();
    }
  });

  console.log("100% processed");
  $("#loading").hide();
  console.log("All processing done");

  let mbUsed = window.performance.memory.usedJSHeapSize / 1000000;
  console.log("Currently using " + mbUsed + "MB of memory");

}

document.getElementById("upload").addEventListener("change", (event) => {
  console.log("Using an accuracy of " + latLongAccuracy);
  clearMarkers();
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

function clearMarkers() {
  console.log("Clearing all markers");
  marker_positions = [];
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
