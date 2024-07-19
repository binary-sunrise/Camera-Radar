mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJoYXlmenYyIiwiYSI6ImNsZXNzZW9mcTAyanozem83am12NmJlczQifQ._w2s02CV9Ufl62nRwCrY9w";

import { locations } from "../data/AI_camera.js";
import { createCameraListing, sortList } from "./listing.js";
import { flytoLocation, createPopup , scrollIntoView } from "./utils.js";
import { addMarkers } from "./marker.js";

// Map initialisation

export const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/navigation-day-v1",
  center: [76.69812, 9.09096],
  zoom: 7.61,
  scrollZoom: true,
});

// Geolocation control
export const geolocate = new mapboxgl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  trackUserLocation: false,
  showUserHeading: true,
});

// Geocoding init

export const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: true,
  bbox: [69.30721, 7.58554, 83.24882, 13.04131],
});

// assigning unique id for features

locations.features.forEach((location, i) => {
  location.properties.id = i;
});

// Load events

map.on("load", () => {
  /* Add the data to your map as a layer */
  map.addSource("locations", {
    type: "geojson",
    data: locations,
  });

  map.addControl(geocoder, "top-left");

  map.addControl(geolocate, 'bottom-right');  

  addMarkers();

  createCameraListing(locations);
});

// controller events

  // Event listener for geocoder
  geocoder.on('result', (event) => {
    const searchResult = event.result.geometry;
    sortList(searchResult);
  });

  // Event listener for geolocate
  geolocate.on('geolocate', (position) => {
    const searchResult = {
      type: 'Point',
      coordinates: [position.coords.longitude, position.coords.latitude]
    };
    sortList(searchResult);
  });



//   Click Events

map.on("click", (event) => {
  /* Determine if a feature in the "locations" layer exists at that point. */
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["unclustered-marker"],
  });

  /* If it does not exist, return */
  if (!features.length) return;

  const clickedPoint = features[0];

  /* Fly to the point */
  flytoLocation(clickedPoint);

  /* Close all other popups and display popup for clicked store */
  createPopup(clickedPoint);

  /* Highlight listing in sidebar (and remove highlight for all other listings) */
  scrollIntoView(clickedPoint);
});



