var map;
var markers = [];

if ("geolocation" in navigator){
  navigator.geolocation.getCurrentPosition(onLocation, onError);
}

function onLocation(position){
  // We can't just directly feed the position into our google map
  // The objects are formatted differently, google maps is looking for
  // an object with "lat" and "lng" keys.
  var myPosition = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  var myPosMarker = {
      "position": myPosition,
      "addr": "You are here"
  }
  markers.push(myPosMarker);
  createMap(myPosMarker);
  setupAutocomplete();
  loadMarkers();
}

function onError(err){
  console.log("What are you using, IE 7??", err);
}

function createMap(myPosMarker){
  map = new google.maps.Map($('#map')[0], {
    center: myPosMarker.position,
    zoom: 17
  });
  createMarker(myPosMarker);
}

function showWindow() {
    console.log(this);
}

function createMarker(myPosMarker) {
    var marker = new google.maps.Marker({
        position: myPosMarker.position,
        map: map
    });
    marker.addListener('click', showWindow.bind(myPosMarker));
}

function setupAutocomplete() {
    var input = $('#get-places')[0];
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        console.log(place);
        if(place.geometry.location) {
            var myPlace = {
                "position": place.geometry.location,
                "addr": place.formatted_address
            }
            createMarker(myPlace);
            saveMarker(myPlace);
        } else {
            alert("The place has no location...?");
        }
    });
}

function saveMarker(marker) {
    if(window.localStorage.getItem("makers")) {
        markers = JSON.parse(window.localStorage.getItem("makers"));
    }
    markers.push(marker);
    var stringifiedMarkers = JSON.stringify(markers);
    window.localStorage.setItem("markers", stringifiedMarkers);
}

function loadMarkers() {
    JSON.parse(window.localStorage.getItem("markers")).forEach(function(marker) {
        console.log(marker);
        markers.push(marker);
        createMarker(marker);
    });
}
