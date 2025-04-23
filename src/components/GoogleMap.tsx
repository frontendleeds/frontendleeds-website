"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 51.5074, // Default to London (fallback)
  lng: -0.1278,
};

const MapWithPostcode = ({ postcode, apiKey }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const geocodePostcode = useCallback(async () => {
    if (!postcode) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode)}&key=${apiKey}`
      );
      const data = await response.json();

      console.log(data, "***DATA POSTCODE*****")

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        setCenter({ lat, lng });
      } else {
        setError('Location not found');
      }
    } catch {
      setError('Failed to fetch location');
    } finally {
      setLoading(false);
    }
  }, [postcode, apiKey]);

  useEffect(() => {
    geocodePostcode();
  }, [geocodePostcode]);

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>{error}</div>;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithPostcode;