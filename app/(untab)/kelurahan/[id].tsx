import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
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

// Same data as in map.tsx - ideally this would come from a shared store or API
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

export default function KelurahanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [kelurahanData, setKelurahanData] = useState<KelurahanRisk | null>(null);

  const snapPoints = useMemo(() => ['85%'], []);

  useEffect(() => {
    // Find the kelurahan data by id
    const data = jakartaKelurahanData.find((item) => item.id === id);
    setKelurahanData(data || null);

    // Auto-present the bottom sheet when component mounts
    const timer = setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 100);

    return () => clearTimeout(timer);
  }, [id]);

  const handleSheetDismiss = useCallback(() => {
    router.back();
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  const getRiskBadgeProps = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return { className: 'bg-green-200 border-green-300', textColor: 'text-green-700' };
      case 'moderate':
        return { className: 'bg-yellow-200 border-yellow-300', textColor: 'text-yellow-700' };
      case 'high':
        return { className: 'bg-orange-200 border-orange-300', textColor: 'text-amber-700' };
      case 'critical':
        return { className: 'bg-red-200 border-red-300', textColor: 'text-red-700' };
      default:
        return { className: 'bg-gray-100 border-gray-300', textColor: 'text-gray-700' };
    }
  };

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

  if (!kelurahanData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">Kelurahan not found</Text>
          <TouchableOpacity
            className="mt-4 rounded-lg bg-teal-600 px-6 py-3"
            onPress={handleBackPress}>
            <Text className="font-semibold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const badgeProps = getRiskBadgeProps(kelurahanData.riskLevel);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Back Button */}
      <TouchableOpacity
        className="absolute left-4 top-14 z-20 rounded-full bg-white p-2 shadow-md"
        onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={30} color="#0f766e" />
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onDismiss={handleSheetDismiss}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#ffffff' }}>
        <BottomSheetView className="flex-1 px-6 py-4">
          {/* Header */}
          <View className="mb-6 items-center">
            <View className="mb-4 rounded-full bg-teal-100 p-4">
              <Ionicons name={getRiskIcon(kelurahanData.riskLevel)} size={40} color="#0f766e" />
            </View>
            <Text className="mb-2 text-center text-2xl font-bold text-gray-900">
              {kelurahanData.kelurahan}
            </Text>
            <Text className="mb-4 text-center text-lg text-gray-600">
              Kecamatan {kelurahanData.kecamatan}
            </Text>

            {/* Risk Level Badge */}
            <Badge className={`flex-row gap-2 rounded-full px-4 py-2 ${badgeProps.className}`}>
              <Ionicons
                name={getRiskIcon(kelurahanData.riskLevel)}
                size={16}
                color={badgeProps.textColor.replace('text-', '')}
              />
              <Text className={`text-sm font-bold capitalize ${badgeProps.textColor}`}>
                {kelurahanData.riskLevel} Risk
              </Text>
            </Badge>
          </View>

          {/* Location Info */}
          <View className="mb-6 rounded-xl bg-gray-50 p-4">
            <Text className="mb-2 text-lg font-semibold text-gray-900">Location</Text>
            <View className="flex-row items-center gap-2">
              <Ionicons name="location" size={16} color="#6b7280" />
              <Text className="text-gray-600">
                {kelurahanData.latitude.toFixed(4)}, {kelurahanData.longitude.toFixed(4)}
              </Text>
            </View>
          </View>

          {/* Issues */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-900">Current Issues</Text>
            <View className="flex-row flex-wrap gap-2">
              {kelurahanData.issues.map((issue, index) => (
                <View key={index} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <Text className="text-sm text-gray-700">{issue}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Additional Info */}
          <View className="mb-6 rounded-xl bg-teal-50 p-4">
            <Text className="mb-2 text-lg font-semibold text-teal-800">Environmental Status</Text>
            <Text className="text-sm text-teal-700">
              This kelurahan has been classified as {kelurahanData.riskLevel} risk based on current
              environmental and health indicators. Regular monitoring is being conducted to track
              changes in conditions.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="mt-auto flex-row gap-3">
            <TouchableOpacity className="flex-1 rounded-lg bg-teal-600 py-3">
              <Text className="text-center font-semibold text-white">View on Map</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 rounded-lg border border-teal-600 py-3">
              <Text className="text-center font-semibold text-teal-600">Report Issue</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
