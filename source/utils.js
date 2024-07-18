import { locations } from '../data/AI_camera.js';
import {map} from'./map.js'


// FlytoLocation
export const flytoLocation = (location) => {

    map.flyTo({
        center :location.geometry.coordinates,
        zoom :15
    });

}

// create Popup

export const createPopup = (location) =>{

    const popups = document.getElementsByClassName('mapboxgl-popup');

    /** Check if there is already a popup on the map and if so, remove it */
    if (popups[0]) popups[0].remove();

    const popup = new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat(location.geometry.coordinates)
    .setHTML(`<h3>${location.properties.Name}</h3><h4>${location.properties.Unique_ID}</h4>`)
    .addTo(map);

}


// Create Marker

export const addMarkers = () => {
  /* For each feature in the GeoJSON object above: */
  for (const marker of locations.features) {
    /* Create a div element for the marker. */
    const el = document.createElement('div');
    /* Assign a unique `id` to the marker. */
    el.id = `marker-${marker.properties.id}`;
    /* Assign the `marker` class to each marker for styling. */
    el.className = 'marker';

    el.addEventListener('click', (e) => {
      /* Fly to the point */
      flytoLocation(marker);
      /* Close all other popups and display popup for clicked store */
      createPopup(marker);
      /* Highlight listing in sidebar */
      const activeItem = document.getElementsByClassName('active');
      e.stopPropagation();
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      const listing = document.getElementById(`listing-${marker.properties.id}`);
      listing.classList.add('active');

      /* Scroll to the listing */
      listing.scrollIntoView({block: "start",behavior: "smooth"});
    });

    /**
     * Create a marker using the div element
     * defined above and add it to the map.
     **/
    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
  }
}

// scroll into Listing item

export const scrollIntoView = (location) =>{
    /* Highlight listing in sidebar (and remove highlight for all other listings) */
    const activeItem = document.getElementsByClassName("active");
    if (activeItem[0]) {
      activeItem[0].classList.remove("active");
    }
    const listing = document.getElementById(`listing-${location.properties.id}`);
    listing.classList.add("active");
  
    /* Scroll to the listing */
    listing.scrollIntoView({block: "start",behavior: "smooth"});
}


// Bounding Box logic

export const getBbox =(locations,searchResult)=>{
    const lats = [
        locations.features[0].geometry.coordinates[1],
        searchResult.coordinates[1]
      ];

    const lons = [
        locations.features[0].geometry.coordinates[0],
        searchResult.coordinates[0]
    ];

    const sortedLons = lons.sort((a, b) => {
        if (a > b) {
          return 1;
        }
        if (a.distance < b.distance) {
          return -1;
        }
        return 0;
      });
      const sortedLats = lats.sort((a, b) => {
        if (a > b) {
          return 1;
        }
        if (a.distance < b.distance) {
          return -1;
        }
        return 0;
      });
      return [
        [sortedLons[0], sortedLats[0]],
        [sortedLons[1], sortedLats[1]]
      ];
}