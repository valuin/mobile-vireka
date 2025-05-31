import React, { useState } from 'react';
import { View, TextInput, Alert, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import Text from '~/components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp } from '~/hooks/useAuth';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
    phone: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const signUpMutation = useSignUp();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    console.log('Sign up button pressed');

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    const signUpData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      phone: formData.phone ? parseInt(formData.phone) : undefined,
    };

    signUpMutation.mutate(signUpData, {
      onSuccess: () => {
        console.log('Sign up successful, navigating to home');
        router.replace('/(tabs)/home');
      },
      onError: (error) => {
        console.log('Sign up failed:', error.message);
        Alert.alert('Sign Up Failed', error.message);
      },
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text weight="extrabold" variant="heading" className="mb-2 text-4xl text-gray-900">
            Join Vireka
          </Text>
          <Text variant="body" className="mb-8 text-gray-600">
            Create your account to monitor environmental health
          </Text>

          <View className="mb-7 flex-row items-center gap-2">
            <Text weight="semibold" variant="body" className="text-gray-600">
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(untab)/sign-in')}>
              <Text weight="bold" className="text-teal-600">
                Sign In
              </Text>
            </Pressable>
          </View>

          <View className="space-y-4">
            {errors.name && (
              <Text variant="caption" className="mb-2 text-red-500">
                {errors.name}
              </Text>
            )}

            <View
              className={`flex-row items-center rounded-lg border-2 bg-white px-3 py-3 ${
                errors.name ? 'border-red-500' : 'border-teal-600'
              }`}>
              <Ionicons name="person" size={20} color="#0d9488" />
              <TextInput
                className="ml-2 flex-1 text-base text-gray-900"
                placeholder="Full Name"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                autoCapitalize="words"
              />
            </View>

            {errors.email && (
              <Text variant="caption" className="mb-2 text-red-500">
                {errors.email}
              </Text>
            )}

            <View
              className={`flex-row items-center rounded-lg border-2 bg-white px-3 py-3 ${
                errors.email ? 'border-red-500' : 'border-teal-600'
              }`}>
              <Ionicons name="mail" size={20} color="#0d9488" />
              <TextInput
                className="ml-2 flex-1 text-base text-gray-900"
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="flex-row items-center rounded-lg border-2 border-teal-600 bg-white px-3 py-3">
              <Ionicons name="call" size={20} color="#0d9488" />
              <TextInput
                className="ml-2 flex-1 text-base text-gray-900"
                placeholder="Phone Number (Optional)"
                placeholderTextColor="#9ca3af"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            {errors.password && (
              <Text variant="caption" className="mb-2 text-red-500">
                {errors.password}
              </Text>
            )}

            <View
              className={`flex-row items-center rounded-lg border-2 bg-white px-3 py-3 ${
                errors.password ? 'border-red-500' : 'border-teal-600'
              }`}>
              <Ionicons name="lock-closed" size={20} color="#0d9488" />
              <TextInput
                className="ml-2 flex-1 text-base text-gray-900"
                placeholder="Create Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!passwordVisible}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {errors.confirmPassword && (
              <Text variant="caption" className="mb-2 text-red-500">
                {errors.confirmPassword}
              </Text>
            )}

            <View
              className={`flex-row items-center rounded-lg border-2 bg-white px-3 py-3 ${
                errors.confirmPassword ? 'border-red-500' : 'border-teal-600'
              }`}>
              <Ionicons name="lock-closed" size={20} color="#0d9488" />
              <TextInput
                className="ml-2 flex-1 text-base text-gray-900"
                placeholder="Confirm Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!confirmPasswordVisible}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Ionicons
                  name={confirmPasswordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            <Pressable
              onPress={handleSignUp}
              disabled={signUpMutation.isPending}
              className="mt-6 w-full items-center rounded-lg bg-teal-600 py-3 active:bg-teal-700">
              <Text weight="bold" variant="button" className="text-lg text-white">
                {signUpMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Pressable>

            <View className="my-6 flex-row items-center">
              <View className="h-px flex-1 bg-gray-300" />
              <Text variant="caption" className="mx-2 text-gray-400">
                Or
              </Text>
              <View className="h-px flex-1 bg-gray-300" />
            </View>

            <Pressable
              onPress={() => router.push('/(untab)/sign-in')}
              className="w-full items-center rounded-lg border-2 border-teal-600 py-3">
              <Text weight="bold" variant="button" className="text-base text-teal-600">
                Sign In Instead
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
