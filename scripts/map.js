var is_tracking = false;
var userLng = -120;
var userLat = 50;
var centerOnLocation = false;
var altLng = 0;
var altLat = 0;
var map;


// MAPBOX DISPLAY
function showEventsOnMap() {
  // Defines basic mapbox data
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ";

  if(centerOnLocation){
    map = new mapboxgl.Map({
      container: "map", // Container ID
      style: "mapbox://styles/mapbox/streets-v11", // Styling URL
      center: [altLng, altLat], // Starting position
      zoom: 15, // Starting zoom
    });
  }else{
    map = new mapboxgl.Map({
      container: "map", // Container ID
      style: "mapbox://styles/mapbox/streets-v11", // Styling URL
      center: [userLng, userLat], // Starting position
      zoom: 12, // Starting zoom
    });
  }







  // Add user controls to map
  map.addControl(new mapboxgl.NavigationControl());

  // Adds map features
  map.on("load", () => {
    const features = []; // Defines an empty array for information to be added to

    // Defines map pin icon
    map.loadImage(
      "https://cdn.pixabay.com/photo/2014/04/02/10/38/sign-304093_1280.png",
      (error, image) => {
        if (error) throw error;

        //https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png
        // Add the image to the map style.
        map.addImage("eventpin", image); // Pin Icon

        // READING information from "events" collection in Firestore
        db.collection("hazards")
          .get()
          .then((allHazards) => {
            allHazards.forEach((hazard) => {
              // get Hazard Coordinates
              lng = hazard.data().lng;
              lat = hazard.data().lat;
              coordinates = [lng, lat];
              // console.log(lng, lat);
              // console.log(coordinates);
              //read name and the details of hazard
              event_name = hazard.data().title; // Event Name
              preview = hazard.data().description; // Text Preview
              image = hazard.data().image;
              
              // Pushes information into the features array
              features.push({
                type: "Feature",
                properties: {
                  description: `<strong>${event_name}</strong><p>${preview}</p><img src="` + image + `" alt="No Image"> <br> <a href="/hazard-page.html?hazard=${hazard.id}" target="_blank" title="Opens in a new window">Read more</a>`,
                },
                geometry: {
                  type: "Point",
                  coordinates: coordinates,
                },
              });
            });

            // Adds features as a source to the map
            map.addSource("places", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: features,
              },
            });

            // Creates a layer above the map displaying the pins
            map.addLayer({
              id: "places",
              type: "symbol",
              source: "places",
              layout: {
                "icon-image": "eventpin", // Pin Icon
                "icon-size": 0.03, // Pin Size
                "icon-allow-overlap": true, // Allows icons to overlap
              },
            });

            // Map On Click function that creates a popup, displaying previously defined information from "events" collection in Firestore
            map.on("click", "places", (e) => {
              // Copy coordinates array.
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = e.features[0].properties.description;

              // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on("mouseenter", "places", () => {
              map.getCanvas().style.cursor = "pointer";
            });

            // Defaults cursor when not hovering over the places layer
            map.on("mouseleave", "places", () => {
              map.getCanvas().style.cursor = "";
            });

  //Show User Location on map
  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
  });
  map.addControl(geolocate);
  geolocate.on("geolocate", () => {});
  geolocate.on("trackuserlocationstart", () => {
    is_tracking = true;
    console.log("is trackin");
  });
  geolocate.off("trackuserlocationstart", () => {
    is_tracking = false;
    console.log("isnt trackin");
  });


          });
      }
    );
  });
}


// map.setCenter(new mapboxgl.LngLat(newLong, newLat));
// map.zoom = newZoom;




//Get User Location For Variables
navigator.geolocation.getCurrentPosition(locSuccess, locError, {
  enableHighAccuracy: true,
});
function locSuccess(position) {
  userLng = position.coords.longitude;
  userLat = position.coords.latitude;
  showEventsOnMap();
  
}

function locError() {
  console.log("Error getting user position");
}

// function centerOn( newLong, newLat, newZoom){
//   map.flyTo({
//     center: [newLong, newLat],
//     zoom: newZoom
//   });
// }