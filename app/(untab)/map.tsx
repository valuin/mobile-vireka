import React, { useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Badge } from '~/components/Badge';

interface KelurahanRisk {
  id: string;
  latitude: number;
  longitude: number;
  kelurahan: string;
  kecamatan: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  issues: string[];
}

const jakartaKelurahanData: KelurahanRisk[] = [
  {
    id: '1',
    latitude: -6.2088,
    longitude: 106.8456,
    kelurahan: 'Menteng',
    kecamatan: 'Menteng',
    riskLevel: 'high',
    issues: ['High PM2.5', 'Traffic Pollution'],
  },
  {
    id: '2',
    latitude: -6.1751,
    longitude: 106.865,
    kelurahan: 'Kemayoran',
    kecamatan: 'Kemayoran',
    riskLevel: 'moderate',
    issues: ['Flood Risk', 'Poor Drainage'],
  },
  {
    id: '3',
    latitude: -6.2297,
    longitude: 106.8177,
    kelurahan: 'Kebayoran Baru',
    kecamatan: 'Kebayoran Baru',
    riskLevel: 'critical',
    issues: ['Dengue Outbreak', 'Standing Water'],
  },
  {
    id: '4',
    latitude: -6.1944,
    longitude: 106.8229,
    kelurahan: 'Grogol Petamburan',
    kecamatan: 'Grogol Petamburan',
    riskLevel: 'low',
    issues: ['Good Air Quality'],
  },
];

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

  const autoFitMarkers = () => {
    if (mapRef.current && jakartaKelurahanData.length > 0) {
      const coords = jakartaKelurahanData.map(({ latitude, longitude }) => ({
        latitude,
        longitude,
      }));
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      autoFitMarkers();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getRiskBadgeProps = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return { className: 'bg-green-100 border-green-300', textColor: 'text-green-700' };
      case 'moderate':
        return { className: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-700' };
      case 'high':
        return { className: 'bg-orange-100 border-orange-300', textColor: 'text-orange-700' };
      case 'critical':
        return { className: 'bg-red-100 border-red-300', textColor: 'text-red-700' };
      default:
        return { className: 'bg-gray-100 border-gray-300', textColor: 'text-gray-700' };
    }
  };

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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Jakarta Risk Map</Text>
        <View className="w-10" />
      </View>

      {/* Map */}
      <View className="flex-1">
        <MapView
          ref={mapRef}
          className="flex-1"
          provider={PROVIDER_DEFAULT}
          showsUserLocation
          showsMyLocationButton
          initialRegion={{
            latitude: -6.2088,
            longitude: 106.8456,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
          onMapReady={() => {
            console.log('Full map ready');
            autoFitMarkers();
          }}>
          {jakartaKelurahanData.map((location) => (
            <Marker
              key={location.id}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              pinColor={getMarkerColor(location.riskLevel)}
              onPress={() => {
                console.log('Kelurahan pressed:', location.kelurahan);
              }}>
              <View className="items-center">
                <View className="mb-1 rounded-lg border border-gray-200 bg-white px-2 py-1">
                  <Text className="text-xs font-semibold text-gray-900">{location.kelurahan}</Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Legend */}
      <View className="border-t border-gray-200 bg-white px-4 py-3">
        <Text className="mb-3 text-sm font-semibold text-gray-900">Risk Levels</Text>
        <View className="flex-row flex-wrap gap-2">
          {['low', 'moderate', 'high', 'critical'].map((level) => {
            const badgeProps = getRiskBadgeProps(level);
            return (
              <Badge key={level} className={`rounded-full px-2 py-1 ${badgeProps.className}`}>
                <Text className={`text-xs font-medium capitalize ${badgeProps.textColor}`}>
                  {level}
                </Text>
              </Badge>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
