import { KelurahanData } from '~/types/kelurahan';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';

export const fetchKelurahanByKecamatan = async (
  kecamatanName: string
): Promise<KelurahanData[]> => {
  console.log('Fetching kelurahan data for kecamatan:', kecamatanName);
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Environment variables:', {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    NODE_ENV: process.env.EXPO_PUBLIC_NODE_ENV,
  });

  const url = `${API_BASE_URL}/get-infrastructure/allKelurahan?kecamatanName=${encodeURIComponent(
    kecamatanName
  )}`;
  console.log('Full API URL:', url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  console.log('Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.log('Error response body:', errorText);
    throw new Error(
      `Failed to fetch kelurahan data: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  console.log('API Response success:', data);

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('No kelurahan data found for the specified kecamatan');
  }

  return data;
};
