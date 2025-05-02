import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import { router } from 'expo-router';
import React, { useState } from 'react'; // Import useState
import { Alert, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'; // Import Image dan Alert

const BankAccountInfoScreen = () => {
  // State untuk menyimpan URI gambar yang dipilih
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Fungsi untuk memilih gambar
  const pickImage = async () => {
    // Meminta izin akses ke galeri
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Izin Diperlukan', 'Anda perlu memberikan izin untuk mengakses galeri foto.');
      return;
    }

    // Meluncurkan pemilih gambar
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Hanya izinkan gambar
      allowsEditing: true, // Izinkan pengeditan (crop, rotate)
      aspect: [4, 3], // Rasio aspek untuk editor
      quality: 1, // Kualitas gambar (0-1)
    });

    // Cek jika pengguna tidak membatalkan
    if (!result.canceled) {
      // Ambil URI gambar dari hasil
      setImageUri(result.assets[0].uri);
      console.log(result.assets[0].uri); // Tampilkan URI di console (opsional)
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="relative flex-row items-center justify-center px-4 py-4 bg-red-500 h-[10%]">
        <TouchableOpacity className="absolute top-0 bottom-0 flex justify-center mt-10 left-4" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="mt-10 text-lg font-semibold text-white">Informasi Rekening Bank</Text>
      </View>

      <View className="flex-1 px-5 pt-4">
        {/* Info Banner */}
        <View className="flex-row items-center p-3 mb-6 rounded-md bg-blue-50">
          <Ionicons name="information-circle-outline" size={24} color="#3b82f6" />
          <Text className="ml-2 text-sm text-gray-600">Informasi ini dibutuhkan untuk proses pembayaran insentif Jumatik Anda</Text>
        </View>

        {/* Form Fields */}
        <View className="mb-5">
          <Text className="mb-2 text-base font-medium text-gray-800">Nama Bank</Text>
          <TextInput placeholder="Tulis nama bank" className="px-4 py-3 text-gray-700 border border-gray-300 rounded-md" />
        </View>

        <View className="mb-5">
          <Text className="mb-2 text-base font-medium text-gray-800">Nomor Rekening</Text>
          <TextInput placeholder="Tulis nomor rekening" className="px-4 py-3 text-gray-700 border border-gray-300 rounded-md" keyboardType="number-pad" />
        </View>

        <View className="mb-5">
          <Text className="mb-2 text-base font-medium text-gray-800">Nama Pemilik</Text>
          <TextInput placeholder="Tulis nama pemilik rekening" className="px-4 py-3 text-gray-700 border border-gray-300 rounded-md" />
        </View>

        {/* Tombol Pilih Gambar */}
        <TouchableOpacity
          className="flex-row items-center justify-center py-3 mt-2 border border-blue-500 rounded-md" // Ubah warna border/style sesuai keinginan
          onPress={pickImage} // Panggil fungsi pickImage saat ditekan
        >
          <Ionicons name="image-outline" size={18} color="#3b82f6" /> {/* Ganti ikon */}
          <Text className="ml-2 text-base font-medium text-blue-500">Pilih Gambar Bukti</Text> {/* Ganti teks */}
        </TouchableOpacity>

        {/* Tampilkan gambar yang dipilih */}
        {imageUri && (
          <View className="items-center mt-4">
            <Image source={{ uri: imageUri }} className="w-40 rounded-md h-30" />
            <TouchableOpacity onPress={() => setImageUri(null)} className="mt-2">
              <Text className="text-red-500">Hapus Gambar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default BankAccountInfoScreen;
