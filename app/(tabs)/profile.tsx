import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View, Alert, StatusBar } from 'react-native';
import Text from '~/components/Text';
import { useAuth, useSignOut } from '~/hooks/useAuth';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItem {
  icon: IoniconsName;
  title: string;
  route?: Href;
}

const ProfileScreen = () => {
  const { user } = useAuth();
  const signOutMutation = useSignOut();

  console.log('Profile screen - Current user:', user);

  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      title: 'Profile Information',
    },
    {
      icon: 'notifications-outline',
      title: 'Notification Settings',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy & Policy',
    },
    {
      icon: 'warning-outline',
      title: 'Report a Problem',
    },
    {
      icon: 'log-out-outline',
      title: 'Log Out',
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
    } else if (item.title === 'Log Out') {
      Alert.alert('Confirm Log Out', 'Are you sure you want to log out of the app?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            console.log('Logging out user');
            signOutMutation.mutate(undefined, {
              onSuccess: () => {
                console.log('Logout successful, redirecting to sign-in');
                router.replace('/(untab)/sign-in');
              },
              onError: (error) => {
                console.log('Logout error:', error);
                // Even if API call fails, clear local auth and redirect
                router.replace('/(untab)/sign-in');
              },
            });
          },
        },
      ]);
    } else {
      console.log(`Menu pressed: ${item.title}`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View className="items-center bg-teal-600 pb-6 pt-12">
        <Text weight="bold" variant="heading" className="text-2xl text-white">
          Profil
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="items-center py-6">
          <View className="relative">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-teal-100">
              <Ionicons name="person" size={48} color="#0d9488" />
            </View>
            <View className="absolute bottom-0 right-0 rounded-full bg-white p-1">
              <Ionicons name="checkmark-circle" size={18} color="#0d9488" />
            </View>
          </View>

          <Text weight="bold" variant="subheading" className="mt-2 text-lg text-gray-900">
            {user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text variant="caption" className="text-sm text-gray-500">
            {user?.email || 'user@example.com'}
          </Text>
          <View className="mt-2 rounded-full bg-teal-100 px-3 py-1">
            <Text weight="medium" variant="caption" className="text-teal-700">
              {user?.role === 'citizen' ? 'Warga' : user?.role === 'staff' ? 'Staff' : 'Admin'}
            </Text>
          </View>
        </View>

        <View className="px-4 pb-8">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center border-b border-gray-100 py-4"
              onPress={() => handleMenuPress(item)}>
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                <Ionicons name={item.icon} size={20} color="#0d9488" />
              </View>
              <Text weight="medium" variant="body" className="flex-1 text-gray-700">
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="mx-4 mb-8 rounded-lg border-2 border-teal-600 bg-white p-4">
          <Text weight="bold" variant="subheading" className="mb-2 text-teal-700">
            About Vireka
          </Text>
          <Text variant="body" className="text-gray-600">
            Health and Environment Awareness Application for Indonesian Medical Staff
          </Text>
          <Text variant="caption" className="mt-2 text-gray-500">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
