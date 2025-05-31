export interface KelurahanData {
  id?: number;
  province: string;
  infrastructure: string;
  renewable_energy: string;
  poverty_index: number;
  ndvi: number;
  precipitation: number;
  sentinel: number;
  no2: number;
  co: number;
  so2: number;
  o3: number;
  pm25: number;
  ai_investment_score: number;
  period: string;
  level: string;
  aqi: number;
  kecamatan?: string;
  diseases?: {
    overview: string;
    diseaseData: Array<{
      name: string;
      riskLevel: string;
      percentage: number;
      prevention: string[];
      explanationWhyItsFeasible: string;
    }>;
  };
  jumlah_dokter?: number | null;
  jumlah_faskes?: number | null;
  jumlah_penduduk?: number | null;
  longitude: number;
  latitude: number;
}

export interface KelurahanRisk {
  id: string;
  latitude: number;
  longitude: number;
  kelurahan: string;
  kecamatan: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number;
  issues: string[];
  aqi?: number;
  pm25?: number;
  diseases?: any;
  riskFactors?: any;
}
