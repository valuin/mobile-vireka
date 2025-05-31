import { KelurahanData } from '~/types/kelurahan';

export interface RiskFactors {
  airQuality: number;
  environmentalHealth: number;
  diseaseRisk: number;
  socioeconomic: number;
  overall: number;
}

export interface RiskAssessment {
  level: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  factors: RiskFactors;
  primaryConcerns: string[];
}

const calculateAirQualityRisk = (data: KelurahanData): number => {
  // AQI Score (0-100)
  const aqiScore = Math.min((data.aqi / 300) * 100, 100);

  // PM2.5 Score (WHO guideline: 15 μg/m³ annual, 45 μg/m³ 24-hour)
  const pm25Score = Math.min((data.pm25 / 75) * 100, 100);

  // NO2 Score (WHO guideline: 40 μg/m³ annual)
  const no2Score = Math.min((data.no2 / 200) * 100, 100);

  // CO Score (WHO guideline: 30 mg/m³ 1-hour)
  const coScore = Math.min((data.co / 60) * 100, 100);

  // SO2 Score (WHO guideline: 40 μg/m³ 24-hour)
  const so2Score = Math.min((data.so2 / 125) * 100, 100);

  // O3 Score (WHO guideline: 100 μg/m³ 8-hour)
  const o3Score = Math.min((data.o3 / 0.18) * 100, 100);

  // Weighted average (AQI and PM2.5 have higher weight)
  return (
    aqiScore * 0.3 +
    pm25Score * 0.25 +
    no2Score * 0.15 +
    coScore * 0.1 +
    so2Score * 0.1 +
    o3Score * 0.1
  );
};

const calculateEnvironmentalRisk = (data: KelurahanData): number => {
  // NDVI Score (lower NDVI = higher risk)
  const ndviScore = Math.max(0, (1 - data.ndvi) * 100);

  // Precipitation Score (high precipitation = flood/vector risk)
  const precipScore = Math.min((data.precipitation / 20) * 100, 100);

  // Sentinel Score (environmental degradation indicator)
  const sentinelScore = Math.abs(data.sentinel) * 100;

  return ndviScore * 0.4 + precipScore * 0.3 + sentinelScore * 0.3;
};

const calculateDiseaseRisk = (data: KelurahanData): number => {
  if (!data.diseases?.diseaseData) return 20; // Default low risk

  const diseases = data.diseases.diseaseData;
  let totalRisk = 0;
  let riskCount = 0;

  diseases.forEach((disease) => {
    let riskValue = 0;
    switch (disease.riskLevel.toLowerCase()) {
      case 'tinggi':
      case 'high':
        riskValue = 80;
        break;
      case 'sedang':
      case 'medium':
        riskValue = 50;
        break;
      case 'rendah':
      case 'low':
        riskValue = 20;
        break;
      default:
        riskValue = 30;
    }

    // Weight by percentage if available
    const weightedRisk = riskValue * (disease.percentage || 0.5);
    totalRisk += weightedRisk;
    riskCount++;
  });

  return riskCount > 0 ? Math.min((totalRisk / riskCount) * 100, 100) : 20;
};

const calculateSocioeconomicRisk = (data: KelurahanData): number => {
  // Poverty index (higher = more risk)
  const povertyScore = Math.min((data.poverty_index / 12) * 100, 100);

  // Healthcare accessibility (fewer facilities = higher risk)
  const doctorScore = data.jumlah_dokter ? Math.max(0, 100 - (data.jumlah_dokter / 10) * 100) : 70;

  const faskesScore = data.jumlah_faskes ? Math.max(0, 100 - (data.jumlah_faskes / 5) * 100) : 70;

  return povertyScore * 0.5 + doctorScore * 0.25 + faskesScore * 0.25;
};

const generatePrimaryConcerns = (data: KelurahanData, factors: RiskFactors): string[] => {
  const concerns: string[] = [];

  if (factors.airQuality > 60) {
    if (data.pm25 > 35) concerns.push('High PM2.5');
    if (data.aqi > 100) concerns.push('Poor Air Quality');
    if (data.no2 > 100) concerns.push('High NO2');
  }

  if (factors.environmentalHealth > 60) {
    if (data.precipitation > 10) concerns.push('Flood Risk');
    if (data.ndvi < 0.3) concerns.push('Low Vegetation');
  }

  if (factors.diseaseRisk > 60) {
    if (data.diseases?.diseaseData) {
      data.diseases.diseaseData.forEach((disease) => {
        if (
          disease.riskLevel.toLowerCase() === 'tinggi' ||
          disease.riskLevel.toLowerCase() === 'high'
        ) {
          concerns.push(`${disease.name} Risk`);
        }
      });
    }
  }

  if (factors.socioeconomic > 60) {
    if (data.poverty_index > 7) concerns.push('High Poverty');
    if ((data.jumlah_dokter || 0) < 5) concerns.push('Limited Healthcare');
  }

  return concerns.length > 0 ? concerns : ['Good Conditions'];
};

export const calculateRiskAssessment = (data: KelurahanData): RiskAssessment => {
  console.log('Calculating risk for:', data.province);

  const factors: RiskFactors = {
    airQuality: calculateAirQualityRisk(data),
    environmentalHealth: calculateEnvironmentalRisk(data),
    diseaseRisk: calculateDiseaseRisk(data),
    socioeconomic: calculateSocioeconomicRisk(data),
    overall: 0,
  };

  // Calculate weighted overall score
  factors.overall =
    factors.airQuality * 0.3 +
    factors.diseaseRisk * 0.25 +
    factors.environmentalHealth * 0.25 +
    factors.socioeconomic * 0.2;

  console.log('Risk factors:', factors);

  // Determine risk level
  let level: 'low' | 'moderate' | 'high' | 'critical';
  if (factors.overall >= 75) level = 'critical';
  else if (factors.overall >= 55) level = 'high';
  else if (factors.overall >= 35) level = 'moderate';
  else level = 'low';

  const primaryConcerns = generatePrimaryConcerns(data, factors);

  return {
    level,
    score: Math.round(factors.overall),
    factors,
    primaryConcerns,
  };
};
