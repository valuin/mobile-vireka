// App.tsx atau file layar utama Anda
import MapComponent from '@/components/MapCard';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchHouseholds, FormattedHousehold } from '../../service/api'; // Adjust import path if different

import { Camera, PermissionStatus } from 'expo-camera'; // Masih perlu untuk cek izin awal
import { useRouter } from 'expo-router';

export default function App() {
  const [rumahData, setRumahData] = useState<FormattedHousehold[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadRumahData = async () => {
      try {
        const data = await fetchHouseholds();
        setRumahData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadRumahData();
  }, []);

  // Modifikasi handleScanReportPress
  const handleScanReportPress = async () => {
    console.log('Scan Report button pressed');
    try {
      // Cek atau minta izin kamera
      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status === PermissionStatus.GRANTED) {
        // Navigasi ke layar scanner jika izin diberikan
        router.push('/(untab)/scanner'); // Pastikan path ini benar
      } else {
        Alert.alert('Izin Kamera Diperlukan', 'Mohon berikan izin kamera untuk menggunakan fitur ini.', [{ text: 'OK' }]);
      }
    } catch (permissionError) {
      console.error('Error requesting camera permission:', permissionError);
      Alert.alert('Error', 'Tidak dapat meminta izin kamera.', [{ text: 'OK' }]);
    }
  };

  // Fungsi untuk menangani klik pada Nearest Households
  const handleNearestHouseholdsPress = () => {
    console.log('Nearest Households area pressed, navigating to explore');
    router.push('/(untab)/explore');
  };

  // Fungsi untuk menangani klik card rumah
  const handleRumahCardPress = (householdId: string) => {
    console.log('Rumah card pressed, navigating to detail for householdId:', householdId);
    router.push(`./house/${householdId}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#e53935" />
        <Text className="mt-4 text-gray-600">Loading household data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <Text className="text-red-500">Error loading data: {error.message}</Text>
      </SafeAreaView>
    );
  }

  // UI Utama (tanpa logika kamera)
  return (
    <SafeAreaView className="relative flex-1 bg-white">
      <View className="absolute top-0 left-0 right-0 p-4 bg-red-500 h-[46%]" />

      <TouchableOpacity className="absolute top-20 left-11 bg-white h-24 w-[80%] p-4 rounded-xl z-30 flex-row items-center shadow-md" onPress={handleNearestHouseholdsPress}>
        <View className="flex-row items-center flex-1">
          <Ionicons name="location-outline" size={30} color="#000" />
          <View className="flex-col flex-1 ml-1">
            <Text className="text-sm font-bold text-black" numberOfLines={1} ellipsizeMode="tail">
              Nearest Households
            </Text>
            <Text className="mt-1 mb-3 text-xs text-black" numberOfLines={2} ellipsizeMode="tail">
              Find households that need to be checked based on your current location.
            </Text>
          </View>
        </View>
        <Ionicons name="arrow-forward-outline" size={24} color="#000" />
      </TouchableOpacity>

      <View className="absolute right-7 top-32 w-[90%] rounded-b-3xl rounded-xl bg-white p-5 z-10 shadow-md">
        <View className="w-full mb-3 overflow-hidden bg-red-500 rounded-lg h-44">
          <MapComponent data={rumahData} />
        </View>
        <TouchableOpacity className="flex-row items-center justify-center py-2 bg-red-500 rounded-lg">
          <Ionicons name="sync-outline" size={18} color="#fff" />
          <Text className="ml-2 font-bold text-white">Synchronize</Text>
        </TouchableOpacity>
        {/* Tombol Scan Report sekarang memanggil handleScanReportPress yang sudah dimodifikasi */}
        <TouchableOpacity className="flex-row items-center justify-center py-2 mt-3 border-2 border-red-500 rounded-lg" onPress={handleScanReportPress}>
          <Ionicons name="scan" size={18} color="red" />
          <Text className="ml-2 font-bold text-red-500">Scan Report</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4" contentContainerStyle={{ paddingTop: 10 }} showsVerticalScrollIndicator={false}>
        {/* Sesuaikan mt */}
        <Text className="sticky mt-[380px] mb-4 ml-2 text-2xl font-bold">Nearest Households Around You</Text>
        {rumahData.map((rumah) => (
          <TouchableOpacity key={rumah.householdId} className="flex-row p-4 mb-4 bg-white shadow-md rounded-2xl shadow-gray-400" onPress={() => handleRumahCardPress(rumah.householdId)}>
            <Image source={{ uri: rumah.housePhotoKey }} className="w-24 h-24 mr-4 rounded-xl" />
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="flex-row items-center px-2 py-1 mr-2 bg-red-100 rounded-md">
                  <Ionicons name="home-outline" size={14} color="#e53935" />
                  <Text className="ml-1 text-sm text-red-500">{rumah.nomor}</Text>
                </View>
                <View className={`rounded-md px-2 py-1 ${rumah.status === 'Pending' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                  <Text className={`text-sm ${rumah.status === 'Pending' ? 'text-yellow-800' : 'text-green-700'}`}>{rumah.status}</Text>
                </View>
                <Text className="ml-auto text-sm text-gray-500">{rumah.jarak}</Text>
              </View>
              <Text className="text-base font-bold">{rumah.houseOwnerName}</Text>
              <Text className="text-sm text-gray-600">{rumah.fullAddress}</Text>
              <Text className="mt-1 text-sm">
                Larva Area:
                <Text className="font-bold text-red-500"> {rumah.titik} Points</Text>
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <View className="h-20"></View>
      </ScrollView>
    </SafeAreaView>
  );
}
