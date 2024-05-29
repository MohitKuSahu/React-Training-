import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Route from "./Route";

export default function Map({ origin, destination }) {
  const [coordinates, setCoordinates] = useState([]);
  const [mapCenter, setMapCenter] = useState([40.737, -73.923]); 

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (origin && destination) {
        const originResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${origin}&format=json`
        );
        const originData = await originResponse.json();
        const originCoords = [parseFloat(originData[0].lat), parseFloat(originData[0].lon)];

        const destinationResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${destination}&format=json`
        );
        const destinationData = await destinationResponse.json();
        const destinationCoords = [parseFloat(destinationData[0].lat), parseFloat(destinationData[0].lon)];

        setCoordinates([originCoords, destinationCoords]);
      }
    };

    fetchCoordinates();
  }, [origin, destination]);

  useEffect(() => {
    if (coordinates.length === 2) {
      const midLatitude = (coordinates[0][0] + coordinates[1][0]) / 2;
      const midLongitude = (coordinates[0][1] + coordinates[1][1]) / 2;
      setMapCenter([midLatitude, midLongitude]);
    }
  }, [coordinates]);

  return (
    <MapContainer center={mapCenter} zoom={4} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Route source={coordinates[0]} destination={coordinates[1]} />
    </MapContainer>
  );
}
