// service/api.ts

const API_BASE_URL = 'https://silatik-api.valvaltrizt.workers.dev/api';
// Ganti dengan base URL gambar Anda jika housePhotoKey bukan URL lengkap
const IMAGE_BASE_URL = 'https://your-image-base-url.com'; // <-- GANTI JIKA PERLU

// Definisikan tipe data untuk objek rumah tangga yang diterima dari API
interface RawHousehold {
  householdId: string;
  rtId: string;
  fullAddress: string;
  houseOwnerName: string;
  housePhotoKey: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  // Tambahkan properti lain jika API mengembalikannya untuk detail
  // Misalnya: statusActual?: string; titikActual?: number;
}

// Definisikan tipe data untuk objek rumah tangga yang sudah diformat untuk UI
export interface FormattedHousehold {
  householdId: string;
  rtId: string;
  fullAddress: string;
  houseOwnerName: string;
  housePhotoKey: string;
  latitude: number; // Ubah menjadi number
  longitude: number; // Ubah menjadi number
  createdAt: string;
  updatedAt: string;
  status: 'Pending' | 'Selesai'; // Menggunakan Union Type untuk status
  jarak: string; // Mungkin tidak relevan di halaman detail, bisa 'N/A'
  titik: number;
  nomor: string;
  // Tambahkan properti lain yang mungkin Anda perlukan di UI detail
  // notes?: string;
}

// --- Helper Function untuk Formatting (Menghindari Duplikasi Kode) ---
const formatRawHousehold = (item: RawHousehold): FormattedHousehold => {
  // Cek apakah housePhotoKey sudah merupakan URL lengkap
  const photoUrl = item.housePhotoKey.startsWith('http') ? item.housePhotoKey : `${IMAGE_BASE_URL}/${item.housePhotoKey}`; // Sesuaikan jika perlu

  // Logika untuk mendapatkan nomor rumah (sama seperti sebelumnya)
  const addressParts = item.fullAddress.split(',');
  const firstPartWords = addressParts[0]?.trim().split(' ') || [];
  const houseNumber = firstPartWords[firstPartWords.length - 1] || 'N/A';

  // Logika placeholder/default (sesuaikan jika API detail memberikan data asli)
  const status: 'Pending' | 'Selesai' = 'Pending'; // Ganti jika API punya status
  const titik = Math.floor(Math.random() * 10) + 1; // Ganti jika API punya data titik

  return {
    householdId: item.householdId,
    rtId: item.rtId,
    fullAddress: item.fullAddress,
    houseOwnerName: item.houseOwnerName,
    housePhotoKey: photoUrl,
    latitude: parseFloat(item.latitude),
    longitude: parseFloat(item.longitude),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    status: status, // Gunakan status dari API jika ada
    jarak: 'N/A', // Jarak mungkin tidak relevan di sini
    titik: titik, // Gunakan titik dari API jika ada
    nomor: houseNumber,
  };
};
// --------------------------------------------------------------------

export const fetchHouseholds = async (): Promise<FormattedHousehold[]> => {
  try {
    console.log('Fetching all households from:', `${API_BASE_URL}/households`);
    const response = await fetch(`${API_BASE_URL}/households`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
    }

    // Asumsikan API mengembalikan array dari RawHousehold
    const data: RawHousehold[] = await response.json();
    console.log('Raw data received (all):', data.length, 'items');

    // Gunakan helper function untuk memformat setiap item
    const formattedData: FormattedHousehold[] = data.map(formatRawHousehold);

    console.log('Formatted data (all):', formattedData.length, 'items');
    return formattedData;
  } catch (error) {
    console.error('Error fetching households:', error);
    throw error; // Re-throw error untuk ditangani oleh pemanggil
  }
};

// --- Fungsi BARU untuk mengambil detail satu rumah ---
export const fetchHouseholdById = async (id: string): Promise<FormattedHousehold> => {
  try {
    const url = `${API_BASE_URL}/households/${id}`;
    console.log(`Fetching household detail from: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
    }

    // Asumsikan API mengembalikan satu objek RawHousehold untuk detail
    const rawData: RawHousehold = await response.json();
    console.log('Raw data received (single):', rawData);

    // Gunakan helper function yang sama untuk memformat data tunggal
    const formattedData = formatRawHousehold(rawData);

    console.log('Formatted data (single):', formattedData);
    return formattedData;
  } catch (error) {
    console.error(`Error fetching household by ID (${id}):`, error);
    throw error; // Re-throw error untuk ditangani oleh pemanggil
  }
};
// ------------------------------------------------------
