import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router'; // Import Href
import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Definisikan tipe untuk nama ikon Ionicons
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// Definisikan tipe untuk item menu
interface MenuItem {
  icon: IoniconsName;
  title: string;
  route?: Href; // Gunakan Href sebagai tipe untuk route
}

const ProfileScreen = () => {
  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      title: 'Informasi Profil',
    },
    {
      icon: 'card-outline',
      title: 'Informasi Rekening Bank',
      route: '/(untab)/bankAccount', // Rute ini harus sesuai dengan file app/profile/bank-account.tsx
    },
    {
      icon: 'notifications-outline',
      title: 'Pengaturan Notifikasi',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privasi dan Keamanan',
    },
    {
      icon: 'warning-outline',
      title: 'Laporkan Masalah',
    },
    {
      icon: 'log-out-outline',
      title: 'Keluar',
      // Tidak ada route untuk logout, akan ditangani di handleMenuPress
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route); // Sekarang tipe item.route cocok dengan parameter router.push
    } else if (item.title === 'Keluar') {
      // Handle logout logic
      console.log('Logout pressed');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="items-center py-4 bg-red-500 h-[15%]">
        <Text className="mt-20 text-2xl font-semibold text-white">Profil</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Info */}
        <View className="items-center py-6">
          <View className="relative">
            <Image source={{ uri: 'https://via.placeholder.com/100' }} className="w-24 h-24 rounded-full" />
            <View className="absolute bottom-0 right-0 p-1 bg-white rounded-full">
              <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
            </View>
          </View>
          <Text className="mt-2 text-lg font-bold">Sukirman</Text>
          <Text className="text-sm text-gray-500">sukirmansukirjan@gmail.com</Text>
        </View>

        {/* Menu Items */}
        <View className="px-4 pb-8">
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} className="flex-row items-center py-4 border-b border-gray-100" onPress={() => handleMenuPress(item)}>
              <Ionicons name={item.icon} size={24} color="#666" />
              <Text className="ml-3 text-gray-700">{item.title}</Text>
              <View className="items-end flex-1">
                <Ionicons name="chevron-forward" size={24} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
