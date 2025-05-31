import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Badge } from '~/components/Badge';
import { Card } from '~/components/Card';
import { KelurahanDetailBottomSheet } from '~/components/KelurahanDetailBottomSheet';
import { useMapStore } from '~/stores/mapStore';
import { useKelurahanByKecamatan } from '~/hooks/useKelurahanData';
import { KelurahanData, KelurahanRisk } from '~/types/kelurahan';
import { calculateRiskAssessment } from '~/utils/riskCalculator';

const PANEL_HEIGHT = 400;

// Transform API data to KelurahanRisk format
const transformKelurahanData = (apiData: KelurahanData[]): KelurahanRisk[] => {
  return apiData.map((item, index) => {
    console.log('Transforming data for:', item.province);

    const riskAssessment = calculateRiskAssessment(item);

    return {
      id: item.id?.toString() || index.toString(),
      latitude: item.latitude,
      longitude: item.longitude,
      kelurahan: item.province, // API uses 'province' field for kelurahan name
      kecamatan: item.kecamatan || 'kebon jeruk',
      riskLevel: riskAssessment.level,
      riskScore: riskAssessment.score,
      issues: riskAssessment.primaryConcerns,
      aqi: item.aqi,
      pm25: item.pm25,
      diseases: item.diseases,
      riskFactors: riskAssessment.factors,
    };
  });
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { selectedKelurahan, isBottomSheetOpen, openBottomSheet, closeBottomSheet } = useMapStore();
  const { data: kelurahanApiData, isLoading, error } = useKelurahanByKecamatan('kebon jeruk');

  // Transform API data to the format expected by the map
  const jakartaKelurahanData = useMemo(() => {
    if (kelurahanApiData && kelurahanApiData.length > 0) {
      return transformKelurahanData(kelurahanApiData);
    }
    return [];
  }, [kelurahanApiData]);

  const snapPoints = useMemo(() => ['85%'], []);

  // Calculate initial region based on markers
  const initialRegion = useMemo(() => {
    if (jakartaKelurahanData.length === 0) {
      return {
        latitude: -6.1867,
        longitude: 106.7794,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    const latitudes = jakartaKelurahanData.map((item) => item.latitude);
    const longitudes = jakartaKelurahanData.map((item) => item.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const deltaLat = (maxLat - minLat) * 1.5; // Add 50% padding
    const deltaLng = (maxLng - minLng) * 1.5; // Add 50% padding

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(deltaLat, 0.01), // Minimum zoom level
      longitudeDelta: Math.max(deltaLng, 0.01), // Minimum zoom level
    };
  }, [jakartaKelurahanData]);

  // Watch for bottom sheet state changes
  useEffect(() => {
    if (isBottomSheetOpen && selectedKelurahan) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isBottomSheetOpen, selectedKelurahan]);

  const autoFitMarkers = useCallback(() => {
    if (mapRef.current && jakartaKelurahanData.length > 0) {
      const coords = jakartaKelurahanData.map(({ latitude, longitude }) => ({
        latitude,
        longitude,
      }));

      console.log('Fitting map to coordinates:', coords);

      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 120, right: 60, bottom: PANEL_HEIGHT + 20, left: 60 },
        animated: true,
      });
    }
  }, [jakartaKelurahanData]);

  // Auto-fit markers when data changes
  useEffect(() => {
    if (jakartaKelurahanData.length > 0) {
      const timer = setTimeout(() => {
        autoFitMarkers();
      }, 500); // Reduced delay for faster response
      return () => clearTimeout(timer);
    }
  }, [jakartaKelurahanData, autoFitMarkers]);

  const getRiskBadgeProps = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return {
          className: 'bg-green-200 border-green-300',
          textColor: 'text-green-700',
          iconColor: '#15803d',
        };
      case 'moderate':
        return {
          className: 'bg-yellow-200 border-yellow-300',
          textColor: 'text-yellow-700',
          iconColor: '#a16207',
        };
      case 'high':
        return {
          className: 'bg-orange-200 border-orange-300',
          textColor: 'text-amber-700',
          iconColor: '#c2410c',
        };
      case 'critical':
        return {
          className: 'bg-red-200 border-red-300',
          textColor: 'text-orange-700',
          iconColor: '#dc2626',
        };
      default:
        return {
          className: 'bg-gray-100 border-gray-300',
          textColor: 'text-gray-700',
          iconColor: '#374151',
        };
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

  const handleMarkerPress = useCallback(
    (location: KelurahanRisk) => {
      console.log('Marker pressed:', location.kelurahan);
      openBottomSheet(location);
    },
    [openBottomSheet]
  );

  const renderKelurahanItem = ({ item }: { item: KelurahanRisk }) => {
    const badgeProps = getRiskBadgeProps(item.riskLevel);
    const handleKelurahanPress = () => {
      openBottomSheet(item);
    };

    return (
      <TouchableOpacity onPress={handleKelurahanPress}>
        <Card className="mb-3 rounded-xl border border-gray-200 bg-white p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">{item.kelurahan}</Text>
              <Text className="text-sm text-gray-600">Kec. {item.kecamatan}</Text>
              {item.aqi && <Text className="text-xs text-gray-500">AQI: {item.aqi}</Text>}
            </View>
            <Badge className={`flex-row gap-1 rounded-full px-3 py-1 ${badgeProps.className}`}>
              <Text className={`text-md font-medium ${badgeProps.textColor}`}>•</Text>
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
      </TouchableOpacity>
    );
  };
  const handleSheetDismiss = useCallback(() => {
    closeBottomSheet();
  }, [closeBottomSheet]);

  const getRiskIcon = (riskLevel: string) => {
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

  if (isLoading) {
    return (
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0f766e" />
          <Text className="mt-4 text-gray-600">Loading kelurahan data...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="warning-outline" size={48} color="#ef4444" />
          <Text className="mt-4 text-center text-lg font-semibold text-gray-900">
            Failed to load data
          </Text>
          <Text className="mt-2 text-center text-gray-600">
            {error.message || 'Unable to fetch kelurahan data'}
          </Text>
          <TouchableOpacity
            className="mt-4 rounded-lg bg-teal-600 px-6 py-3"
            onPress={() => router.back()}>
            <Text className="font-semibold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-1">
        {/* Back Button */}
        <TouchableOpacity
          className="absolute left-4 z-20 rounded-full bg-white p-2 shadow-md"
          style={{ top: insets.top + 14 }}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="#0f766e" />
        </TouchableOpacity>

        {/* Map Component */}
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_DEFAULT}
          showsUserLocation
          showsMyLocationButton
          region={initialRegion}
          onMapReady={() => {
            console.log('Map ready with', jakartaKelurahanData.length, 'markers');
            // Auto-fit on map ready as well
            setTimeout(() => autoFitMarkers(), 1000);
          }}>
          {jakartaKelurahanData.map((location) => (
            <Marker
              key={location.id}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              onPress={() => handleMarkerPress(location)}
              tracksViewChanges={false}>
              <View className="items-center">
                <View
                  className={`rounded-full p-2 ${getRiskBadgeProps(location.riskLevel).className}`}>
                  <Ionicons
                    name={getRiskIcon(location.riskLevel)}
                    size={20}
                    color={getRiskBadgeProps(location.riskLevel).iconColor}
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
                onChangeText={setSearchQuery}
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

        {/* Kelurahan Detail Bottom Sheet */}
        <KelurahanDetailBottomSheet
          ref={bottomSheetModalRef}
          selectedKelurahan={selectedKelurahan}
          snapPoints={snapPoints}
          onDismiss={closeBottomSheet}
          getRiskIcon={getRiskIcon}
          getRiskBadgeProps={getRiskBadgeProps}
        />
      </View>
    </View>
  );
}
