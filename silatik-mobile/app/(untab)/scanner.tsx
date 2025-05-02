// app/(untab)/scanner.tsx
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { uploadImageFromUri } from '../../service/s3upload'; // Import the upload function

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false); // State for upload loading indicator

  useEffect(() => {
    // Request permission if not granted and can be asked again
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const takePictureAndUpload = async () => {
    // Ensure camera is ready and not already uploading
    if (cameraRef.current && !isUploading) {
      setIsUploading(true); // Start loading state
      try {
        // Capture the picture
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7, // Adjust quality as needed (0.0 to 1.0)
          // You can add other options like base64: false if not needed
        });

        // Check if picture capture was successful and returned a URI
        if (photo && photo.uri) {
          console.log('Photo captured, attempting upload...');

          // Call the upload helper function with the local URI and desired folder
          const uploadResult = await uploadImageFromUri(
            photo.uri,
          );

          // Handle the upload result
          if (!uploadResult || typeof uploadResult !== 'object') {
            Alert.alert('Upload Error', 'Upload result is undefined or invalid.');
            setIsUploading(false);
            return;
          }

          if (uploadResult.success && uploadResult.url) {
            console.log('Upload successful! Public URL:', uploadResult.url);
            Alert.alert('Success', 'Image uploaded successfully!');

            // Validate key existence before using
            if (uploadResult.key) {
              // e.g., save uploadResult.key to state/storage or use as needed
              console.log('Upload key:', uploadResult.key);
            } else {
              Alert.alert('Warning', 'Upload succeeded but no key was returned.');
            }

            // Navigate back if possible, otherwise go home
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/'); // Fallback navigation
            }
          } else {
            // Upload failed, error likely alerted within uploadImageFromUri
            console.log('Upload failed. Check logs from uploadImageFromUri for details.');
            Alert.alert(
              'Upload Failed',
              'Image upload failed. Please check your internet connection and try again.'
            );
          }
        } else {
          // Handle case where takePictureAsync didn't return expected result
          console.error("takePictureAsync didn't return a valid photo object with URI.");
          Alert.alert('Capture Error', 'Failed to get image data.');
        }
      } catch (e: any) {
        // Catch errors during capture or the upload process initiation
        console.error('Failed to take picture or initiate upload:', e);
        Alert.alert('Error', `Failed to capture or upload image: ${e.message || 'Unknown error'}`);
      } finally {
        // Ensure loading state is turned off regardless of success or failure
        setIsUploading(false);
      }
    }
  };

  // --- Permission Handling UI ---
  if (!permission) {
    // Loading permissions
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e53935" />
      </View>
    );
  }

  if (!permission.granted) {
    // Permission denied UI
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>Camera permission is required.</Text>
        <Button onPress={requestPermission} title="Grant Permission" color="#e53935" />
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Camera View UI ---
  return (
    <View style={styles.fullScreen}>
      <CameraView style={styles.fullScreen} facing={'back'} ref={cameraRef}>
        <View style={styles.cameraButtonContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => !isUploading && router.back()} // Prevent closing during upload
            disabled={isUploading}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>

          {/* Capture Button / Loading Indicator */}
          {isUploading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <TouchableOpacity style={styles.captureButtonOuter} onPress={takePictureAndUpload}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          )}

          {/* Spacer to balance the layout */}
          <View style={{ width: 50 }} />
        </View>
      </CameraView>
    </View>
  );
}

// Styles (kept as provided)
const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  permissionText: { textAlign: 'center', marginBottom: 20, fontSize: 16 },
  backButton: { marginTop: 20 },
  backButtonText: { color: '#e53935', fontSize: 16 },
  fullScreen: { flex: 1 },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
  },
  captureButtonOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});
