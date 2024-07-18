import { locations } from "../data/AI_camera.js";
import { map } from './map.js';

// clustering

// Function to cluster markers on the map
// export const addMarkers = () => {

//   // Add a GeoJSON source with clustering options
//   map.addSource('camera-locations', {
//     type: 'geojson',
//     data: locations,
//     cluster: true,
//     clusterMaxZoom: 14,
//     clusterRadius: 50
//   });

//   // Load custom marker image
//   map.loadImage('./data/marker.png', (error, image) => {
//     if (error) throw error;
//     map.addImage('custom-marker', image);
    
//     // Add clustered marker layer
//     map.addLayer({
//       id: 'clustered-marker',
//       type: 'circle',
//       source: 'camera-locations',
//       filter: ['has', 'point_count'],
//       paint: {
//         'circle-color': [
//           'step',
//           ['get', 'point_count'],
//           '#51bbd6',
//           100,
//           '#f1f075',
//           750,
//           '#f28cb1'
//         ],
//         'circle-radius': [
//           'step',
//           ['get', 'point_count'],
//           20,
//           100,
//           30,
//           750,
//           40
//         ]
//       }
//     });

//     // Add cluster count layer
//     map.addLayer({
//       id: 'cluster-count',
//       type: 'symbol',
//       source: 'camera-locations',
//       filter: ['has', 'point_count'],
//       layout: {
//         'text-field': '{point_count_abbreviated}',
//         'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
//         'text-size': 12
//       }
//     });

//     // Add unclustered point layer
//     map.addLayer({
//       id: 'unclustered-marker',
//       type: 'symbol',
//       source: 'camera-locations',
//       filter: ['!', ['has', 'point_count']],
//       layout: {
//         'icon-image': 'custom-marker', // Use the loaded custom marker image
//         'icon-size': 1,
//         'icon-anchor': 'bottom',
//         'icon-allow-overlap': true
//       }
//     });
//   });

  



  export const addMarkers = () => {
    // Add a GeoJSON source with clustering options
    map.addSource('camera-locations', {
      type: 'geojson',
      data: locations,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });
  
    // Load custom marker image
    map.loadImage('./data/marker.png', (error, image) => {
      if (error) throw error;
      map.addImage('custom-marker', image);
  
      // Add clustered marker layer
      map.addLayer({
        id: 'clustered-marker',
        type: 'symbol',
        source: 'camera-locations',
        filter: ['has', 'point_count'],
        layout: {
          'icon-image': 'custom-marker', // Use the loaded custom marker image
          'icon-size': 1,
          'icon-anchor': 'bottom',
          'icon-allow-overlap': true
        }
      });
  
      // Add cluster count layer
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'camera-locations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
          'text-offset': [2, -6], // Offset the text to the top-right of the marker
          'text-anchor': 'top-right' // Adjust the anchor as needed
        },
        paint: {
          'text-color': '#ffffff', // Set text color
          'text-halo-color': '#32CD32', // Set the halo color to paddy green
          'text-halo-width': 1.5, // Set the width of the halo
          'text-halo-blur': 0.5 // Set the halo blur for a smoother appearance
        }
      });
  
      // Add unclustered point layer
      map.addLayer({
        id: 'unclustered-marker',
        type: 'symbol',
        source: 'camera-locations',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': 'custom-marker', // Use the loaded custom marker image
          'icon-size': 1,
          'icon-anchor': 'bottom',
          'icon-allow-overlap': true
        }
      });
    });

            // Add click event for clusters
      map.on('click', 'clustered-marker', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clustered-marker']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('camera-locations').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      // Add mouse enter/leave events for clusters
      map.on('mouseenter', 'clustered-marker', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'clustered-marker', () => {
        map.getCanvas().style.cursor = '';
      });
  };
  


