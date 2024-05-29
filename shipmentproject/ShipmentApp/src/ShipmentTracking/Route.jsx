import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const Route = ({ source, destination }) => {
  const map = useMap();

  useEffect(() => {
    const fetchRoute = async () => {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${source[1]},${source[0]};${destination[1]},${destination[0]}?overview=full`
      );
      const data = await response.json();
      const coordinates = data.waypoints.map((waypoint) => [
        waypoint.location[1],
        waypoint.location[0],
      ]);

    
      L.polyline(coordinates, { color: "red" }).addTo(map);

      const originIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      
      const destinationIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });

      L.marker(coordinates[0], { icon: originIcon }).addTo(map);
      L.marker(coordinates[coordinates.length - 1], { icon: destinationIcon }).addTo(map);
    };

    fetchRoute();
  }, [source, destination, map]);

  return null;
};

export default Route;
