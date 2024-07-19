
import { locations } from '../data/AI_camera.js';
import {flytoLocation ,createPopup ,fitMapBounds } from './utils.js'



// create the list
export const createCameraListing = (locations)=>{
    for (const location of locations.features){

        /* Add a new listing section to the sidebar. */
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));

        // Assign unique id for each listing
        listing.id = `listing-${location.properties.id}`;

        // Assign classname for list elements
        listing.className = 'item';



         /* Add the link to the individual listing created above. */
        const link = listing.appendChild(document.createElement('a'));

        link.href = '#' ;
        link.id = `link-${location.properties.id}`;
        link.className = 'title' ; 
        link.innerHTML = `${location.properties.Name}` ;


        /* Add details to the individual listing. */

        const details = listing.appendChild(document.createElement('div'));

        details.innerHTML = ` Camera ID - ${location.properties.Unique_ID}<br> 
                              District - ${location.properties.District}<br>
                              Type - ${location.properties.Type_of_System}`

        if (location.properties.distance) {
        const roundedDistance = Math.round(location.properties.distance * 100) / 100;
        details.innerHTML += `<div><strong>${roundedDistance} kilometers away</strong></div>`;
        }

        // handle click for the listing item

        link.addEventListener('click',()=>{
            for (const feature of locations.features ){
                if (link.id === `link-${feature.properties.id}`){
                    flytoLocation(feature);
                    createPopup(feature);
                }
            }
            const activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            link.parentNode.classList.add('active');

        });
                              
    
    }
}

export const sortList = (mylocation) => {
  const options = { units: "kilometers" };

  // Add distance property to the data using turf
  locations.features.forEach(location => {
    location.properties.distance = turf.distance(mylocation, location.geometry, options);
  });

  // Sort the list by distance
  locations.features.sort((a, b) => a.properties.distance - b.properties.distance);

  // Clear the existing list
  const listings = document.getElementById("listings");
  while (listings.firstChild) {
    listings.removeChild(listings.firstChild);
  }

  createCameraListing(locations);

  // Highlight the nearest location in the listing
  const activeListing = document.getElementById(`listing-${locations.features[0].properties.id}`);
  if (activeListing) {
    activeListing.classList.add('active');
  }

  fitMapBounds(locations, mylocation);
  createPopup(locations.features[0]);  
};




