import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

interface RiskLocation {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
}

interface MapCardProps {
  riskLocations: RiskLocation[];
}

const MapCard: React.FC<MapCardProps> = ({ riskLocations }) => {
  const mapRef = useRef<MapView>(null);

  const autoFitMarkers = () => {
    if (mapRef.current && riskLocations.length > 0) {
      const coords = riskLocations.map(({ latitude, longitude }) => ({ latitude, longitude }));
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (riskLocations.length > 0) {
      autoFitMarkers();
    }
  }, [riskLocations]);

  const getMarkerColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return '#10b981';
      case 'moderate':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      case 'critical':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_DEFAULT}
      showsUserLocation
      showsMyLocationButton={false}
      className="rounded-lg"
      scrollEnabled={false}
      zoomEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      initialRegion={{
        latitude: -6.2088,
        longitude: 106.8456,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      onMapReady={() => {
        console.log('Map is ready!');
        autoFitMarkers();
      }}>
      {riskLocations.map((location) => (
        <Marker
          key={location.id}
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          tracksViewChanges={false}
          title={location.title}
          description={location.description}
          pinColor={getMarkerColor(location.riskLevel)}
        />
      ))}
    </MapView>
  );
};

export default MapCard;
