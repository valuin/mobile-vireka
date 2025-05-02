// src/components/MapCard.tsx

import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { FormattedHousehold } from '../service/api';

interface MapComponentProps {
  data: FormattedHousehold[];
}

const MapComponent: React.FC<MapComponentProps> = ({ data }) => {
  const mapRef = useRef<MapView>(null);

  // Fungsi untuk melakukan auto-fit
  const autoFitMarkers = () => {
    if (mapRef.current && data.length > 0) {
      const coords = data.map(({ latitude, longitude }) => ({ latitude, longitude }));
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    // Mungkin tidak perlu lagi memanggil autoFitMarkers di sini jika menggunakan onMapReady dan data sudah ada
    // Jika data sudah dimuat sebelum peta siap, onMapReady akan memanggilnya
    // Jika data dimuat setelah peta siap, dependency [data] pada useEffect ini akan memanggilnya
    // autoFitMarkers(); // Mungkin bisa dihapus atau dipertahankan tergantung kebutuhan
  }, [data]); // Tetap pertahankan dependency [data]

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_DEFAULT}
      showsUserLocation
      showsMyLocationButton
      className="rounded-xl"
      // === TAMBAHKAN PROP onMapReady ===
      onMapReady={() => {
        console.log('Map is ready!'); // Untuk debugging
        autoFitMarkers(); // Panggil autoFitMarkers saat peta siap
      }}
      // ===============================
    >
      {data &&
        data.map((item) => (
          <Marker
            key={item.householdId}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            tracksViewChanges={false}
            title={`Mr./Mrs. ${item.houseOwnerName}`}
            description={item.fullAddress}
            onPress={() => {
              console.log('Marker pressed:', item.houseOwnerName);
            }}
          />
        ))}
    </MapView>
  );
};

export default MapComponent;
