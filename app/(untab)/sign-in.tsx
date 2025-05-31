import React, { useState } from 'react';
import { View, TextInput, Alert, Pressable, TouchableOpacity } from 'react-native';
import Text from '~/components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '~/hooks/useAuth';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const signInMutation = useSignIn();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    console.log('Sign in button pressed');

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    signInMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          console.log('Sign in successful, navigating to home');
          router.replace('/(tabs)/home');
        },
        onError: (error) => {
          console.log('Sign in failed:', error.message);
          Alert.alert('Sign In Failed', error.message);
        },
      }
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      edges={['top', 'bottom', 'left', 'right']}>
      <View className="p-6">
        <Text weight='extrabold' className="mb-6 text-4xl font-bold text-gray-900">Welcome to Vireka</Text>

        <View className="mb-7 flex-row items-center gap-2">
          <Text weight='semibold' className="text-base text-gray-600">Don't have an account? </Text>
          <Pressable onPress={() => router.push('/(untab)/sign-up')}>
            <Text weight='semibold' className="font-bold text-teal-600">Sign Up</Text>
          </Pressable>
        </View>

        {errors.email && <Text className="mb-2 text-red-500">{errors.email}</Text>}

        <View
          className={`mb-4 flex-row items-center rounded-lg border-2 bg-white px-3 py-3 ${
            errors.email ? 'border-red-500' : 'border-teal-600'
          }`}>
          <Ionicons name="mail" size={20} color="#0d9488" />
          <TextInput
            className="ml-2 flex-1 text-base text-gray-900"
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {errors.password && <Text className="mb-2 text-red-500">{errors.password}</Text>}

        <View
          className={`mb-6 flex-row items-center rounded-lg border-2 bg-white px-3 py-3 ${
            errors.password ? 'border-red-500' : 'border-teal-600'
          }`}>
          <Ionicons name="lock-closed" size={20} color="#0d9488" />
          <TextInput
            className="ml-2 flex-1 text-base text-gray-900"
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 flex-row justify-end">
          <TouchableOpacity onPress={() => Alert.alert('Forgot Password')}>
            <Text className="font-bold text-teal-600">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Pressable
          onPress={handleSignIn}
          disabled={signInMutation.isPending}
          className="w-full items-center rounded-lg bg-teal-600 py-3 active:bg-teal-700">
          <Text weight='bold' className="text-lg font-semibold text-white">
            {signInMutation.isPending ? 'Signing In...' : 'Sign In'}
          </Text>
        </Pressable>

        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-2 text-gray-400">Or</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>

        <Pressable
          onPress={() => router.push('/(untab)/sign-up')}
          className="w-full items-center rounded-lg border-2 border-teal-600 py-3">
          <Text weight='bold' className="text-base font-medium text-teal-600">Create New Account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
