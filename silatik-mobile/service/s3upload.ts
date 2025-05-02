// service/s3upload.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

// --- Load S3 config from environment variables ---
const accessKeyId = process.env.EXPO_PUBLIC_S3_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.EXPO_PUBLIC_S3_SECRET_ACCESS_KEY || '';
const endpoint = process.env.EXPO_PUBLIC_S3_ENDPOINT || '';
const region = process.env.EXPO_PUBLIC_S3_REGION || '';
const bucketName = process.env.EXPO_PUBLIC_S3_BUCKET_NAME || '';
const customDomain = process.env.EXPO_PUBLIC_S3_CUSTOM_DOMAIN || '';

if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName || !region) {
  console.error('S3 config incomplete. Check your .env and restart Expo.');
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint,
  forcePathStyle: true,
});

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function uploadImageFromUri(
  localUri: string,
  folder = 'images'
): Promise<{ success: boolean; url: string | null; key: string | null }> {
  if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName || !region) {
    Alert.alert('S3 Config Error', 'S3 configuration is incomplete.');
    return { success: false, url: null, key: null };
  }

  let key: string | null = null;
  try {
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64 });
    const fileName = localUri.split('/').pop() || `upload-${Date.now()}.jpg`;
    key = `${folder}/${Date.now()}-${fileName.replace(/\s+/g, '_')}`;
    const cleanEndpoint = endpoint.replace(/\/$/, '');
    const s3Url = `${cleanEndpoint}/${bucketName}/${key}`;

    // Guess content type from extension (simple fallback)
    let fileType = 'application/octet-stream';
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) fileType = 'image/jpeg';
    else if (fileName.endsWith('.png')) fileType = 'image/png';

    // Convert base64 to Uint8Array for upload
    const fileBuffer = base64ToUint8Array(base64);

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: fileType,
    });

    const uploadResponse = await s3Client.send(putCommand);

    if (!uploadResponse || uploadResponse.$metadata?.httpStatusCode !== 200) {
      console.error('S3 Upload Error:', uploadResponse);
      throw new Error(`S3 upload failed: ${uploadResponse?.$metadata?.httpStatusCode}`);
    }

    const publicUrl = customDomain
      ? `https://${customDomain}/${key}`
      : `${s3Url}`;

    return { success: true, url: publicUrl, key };
  } catch (err: any) {
    console.error('Upload error:', err);
    Alert.alert('Upload Failed', err.message || 'An error occurred during upload.');
    return { success: false, url: null, key };
  }
}
