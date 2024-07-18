import { map } from './map.js';
import { locations } from '../data/AI_camera.js';
import {flytoLocation ,createPopup ,getBbox } from './utils.js'
import { geocoder } from './map.js';



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
        details.innerHTML += `<div><strong>${roundedDistance} miles away</strong></div>`;
        }

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

// sort the list

export const sortList = () =>{
    geocoder.on('result', (event) => {
        const searchResult = event.result.geometry;
        // Code for the next step will go here
        const options = { units: "miles" };
        for (const location of locations.features) {
            location.properties.distance = turf.distance(
            searchResult,
            location.geometry,
            options
          );
        }
    
        locations.features.sort((a, b) => {
            if (a.properties.distance > b.properties.distance) {
              return 1;
            }
            if (a.properties.distance < b.properties.distance) {
              return -1;
            }
            return 0; // a must be equal to b
          });
    
          const listings = document.getElementById("listings");
          while (listings.firstChild) {
            listings.removeChild(listings.firstChild);
          }

          createCameraListing(locations);


          const activeListing = document.getElementById(
            `listing-${locations.features[0].properties.id}`
          );
          activeListing.classList.add('active');



          const bbox = getBbox(locations, searchResult);
          map.fitBounds(bbox, {
            padding: 100,
          });

          createPopup(locations.features[0]);
      });
}



