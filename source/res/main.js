// Before doing anything, hide loading div
$("#loading").hide();


// * * * * * * * * * //
// Fancy file upload stuff
// * * * * * * * * * //
function onChange(event) {
  clear_markers();
  $("#loading").show();
  let reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event){
  let obj = JSON.parse(event.target.result);
  loadLocations(obj);
}

function loadLocations(data){
  let divideBy = data.locations.length / 100;
  $.each(data.locations, function(key, val) {
    let lat = val.latitudeE7 / 10000000;
    let lng = val.longitudeE7 / 10000000;
    create_marker(lat, lng);

    if (key % 10000 == 0) {
      console.log(Math.round(key / divideBy) + "% processed");
    }

  });
  $("#loading").hide();
  console.log("100% processed")
}

document.getElementById("upload").addEventListener("change", onChange);


// * * * * * * * * * //
// Main Map Function(s)
// * * * * * * * * * //
let marker_positions = []; // So there aren"t multiple markers in the same place

function initMap() {
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


// * * * * * * * * * //
// Utility Function(s)
// * * * * * * * * * //
function search() {
  let address = document.getElementById("search_box").value;
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

function clear_markers() {
  marker_positions = [];
}

function create_marker(lat, lng) {
  let current_lat_lng = lat.toString() + lng.toString();
  if (marker_positions.includes(current_lat_lng)) {
    // Do nothing, dont need multiple markers in one place
  } else {
    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        icon: "res/dot.png"
    });
    marker_positions.push(current_lat_lng);
  }
}

function get_my_loc() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success_callback, error_callback);
  }
}

function success_callback(position) {
  let new_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  map.panTo(new_location);
}

function error_callback(error) {
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
