// types/inspectionTypes.ts (atau path serupa)

// Tipe untuk menyimpan status checkbox area temuan jentik
export type JentikAreaStatus = {
  bakMandi: boolean;
  wastafel: boolean;
  ember: boolean;
  kolam: boolean;
  lainnya: string; // Untuk menyimpan input teks "Lainnya"
};

// Jika Anda memiliki tipe lain yang terkait dengan inspeksi, tambahkan di sini
// export type InspectionData = { ... };
