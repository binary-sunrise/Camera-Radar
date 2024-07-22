import { locations } from "../data/AI_camera.js";
import { map } from './map.js';


  export const addMarkers = () => {
    // Add a GeoJSON source with clustering options
    map.addSource('camera-locations', {
      type: 'geojson',
      data: locations,
      cluster: true,
      clusterMaxZoom: 16,
      clusterRadius: 30
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
          'text-size': 15,
          'text-offset': [2, -4], // Offset the text to the top-right of the marker
          'text-anchor': 'top-right' // Adjust the anchor as needed
        },
        paint: {
          'text-color': '#000', // Black text color
          'text-halo-color': '#c5f587', // Light green halo color
          'text-halo-width': 8, // Width of the halo to create a pill shape
          'text-halo-blur': 0.5, // Blur to soften the edges
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
  


