import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Badge } from '~/components/Badge';
import { Card } from '~/components/Card';

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

const PANEL_HEIGHT = 400;

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
        return { className: 'bg-green-200 border-green-300', textColor: 'text-green-700' };
      case 'moderate':
        return { className: 'bg-yellow-200 border-yellow-300', textColor: 'text-yellow-700' };
      case 'high':
        return { className: 'bg-orange-200 border-orange-300', textColor: 'text-amber-700' };
      case 'critical':
        return { className: 'bg-red-200 border-red-300', textColor: 'text-orange-700' };
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

  const filteredData = jakartaKelurahanData.filter(
    (item) =>
      item.kelurahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kecamatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackPress = () => {
    router.back();
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const getMarkerIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'checkmark-circle';
      case 'moderate':
        return 'warning';
      case 'high':
        return 'alert-circle';
      case 'critical':
        return 'close-circle';
      default:
        return 'location';
    }
  };

  const renderKelurahanItem = ({ item }: { item: KelurahanRisk }) => {
    const badgeProps = getRiskBadgeProps(item.riskLevel);

    return (
      <Card className="mb-3 rounded-xl border border-gray-200 bg-white p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">{item.kelurahan}</Text>
            <Text className="text-sm text-gray-600">Kec. {item.kecamatan}</Text>
          </View>
          <Badge className={`rounded-full flex-row gap-1 px-3 py-1 ${badgeProps.className}`}>
            <Text className={`text-md font-medium ${badgeProps.textColor}`}>
                •
            </Text>
            <Text className={`text-xs font-bold capitalize ${badgeProps.textColor}`}>
              {item.riskLevel}
            </Text>
          </Badge>
        </View>
        <View className="flex-row flex-wrap gap-1">
          {item.issues.map((issue, index) => (
            <Text key={index} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
              {issue}
            </Text>
          ))}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        {/* Back Button */}
        <TouchableOpacity
          className="absolute left-4 top-14 z-20 rounded-full bg-white p-2 shadow-md"
          onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={30} color="#0f766e" />
        </TouchableOpacity>

        {/* Map Component */}
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
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
              onPress={() => {
                console.log('Kelurahan pressed:', location.kelurahan);
              }}>
              <View className="items-center">
                <View
                  className={`rounded-full p-2 ${getRiskBadgeProps(location.riskLevel).className}`}>
                  <Ionicons
                    name={getMarkerIcon(location.riskLevel)}
                    size={20}
                    color={getRiskBadgeProps(location.riskLevel).textColor.replace('text-', '')}
                  />
                </View>
                <View className="mt-1 rounded-lg border border-gray-200 bg-white px-2 py-1">
                  <Text className="text-xs font-semibold text-gray-900">{location.kelurahan}</Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Bottom Sheet with Search and List */}
        <View
          className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-teal-600"
          style={{ height: PANEL_HEIGHT }}>
          {/* Handle Bar */}
          <View className="my-3 h-1 w-16 self-center rounded-full bg-white/50" />

          {/* Search Bar and Filter Button */}
          <View className="mb-3 flex-row items-center justify-between px-4">
            <View className="mr-2 flex-1 flex-row items-center rounded-lg bg-white px-4 py-2">
              <TextInput
                className="h-10 flex-1 text-gray-700"
                placeholder="Search kelurahan..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <Ionicons name="search" size={20} color="#999" />
            </View>

            <TouchableOpacity className="rounded-lg bg-white p-3 shadow-md">
              <Ionicons name="menu" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Kelurahan List */}
          <FlatList
            data={filteredData}
            renderItem={renderKelurahanItem}
            keyExtractor={(item) => item.id}
            className="px-4 pb-4"
            style={{ height: PANEL_HEIGHT - 80 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Card className="items-center justify-center rounded-xl bg-white p-8">
                <Text className="text-gray-500">No kelurahan found</Text>
              </Card>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
