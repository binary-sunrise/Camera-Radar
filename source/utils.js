
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


export const fitMapBounds = (locations, mylocation) => {
  const lats = [
    locations.features[0].geometry.coordinates[1],
    mylocation.coordinates[1],
  ];

  const lons = [
    locations.features[0].geometry.coordinates[0],
    mylocation.coordinates[0],
  ];

  const sortedLons = lons.sort((a, b) => a - b);
  const sortedLats = lats.sort((a, b) => a - b);

  const bbox = [
    [sortedLons[0], sortedLats[0]], // Southwest corner
    [sortedLons[1], sortedLats[1]], // Northeast corner
  ];

  // Assuming 'map' is your Mapbox map instance
  map.fitBounds(bbox, {
    padding: 100,
  });
};
