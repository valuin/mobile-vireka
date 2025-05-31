import { Ionicons } from '@expo/vector-icons';
import { View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import { Badge } from '~/components/Badge';
import { Button } from '~/components/Button';
import { Card, CardContent } from '~/components/Card';
import MapCard from '~/components/MapCard';
import CitizenReportCard from '~/components/CitizenReportCard';
import Text from '~/components/Text';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useKelurahanByKecamatan } from '~/hooks/useKelurahanData';
import { calculateRiskAssessment } from '~/utils/riskCalculator';
import { WarningIcon } from '~/components/icons/WarningIcon';

const actionablePlans = [
  {
    id: 1,
    title: 'Worsening Air Quality',
    description: 'Consider using air purifiers and ensure good ventilations',
    priority: 'Urgent',
    priorityColor: 'red-200',
    dotColor: 'orange-600',
    image: 'https://img.jakpost.net/c/2019/01/16/2019_01_16_63196_1547653415._large.jpg',
  },
  {
    id: 2,
    title: 'Water Safety',
    description: 'Check for drains & potential flooding sites',
    priority: 'Moderate',
    priorityColor: 'orange-200',
    dotColor: 'amber-600',
    image: 'https://cdn.antaranews.com/cache/1200x800/2024/04/04/InShot_20240404_045126940.jpg',
  },
];

// Data for risk indicators
const riskIndicators = [
  { id: 1, title: 'High PM2.5', icon: 'mountain' },
  { id: 2, title: 'Flood Risk', icon: 'water' },
  { id: 3, title: 'Dengue Spike', icon: 'syringe' },
  { id: 4, title: 'High Humidity', icon: 'tint' },
];

// Sample risk locations for Jakarta
const riskLocations = [
  {
    id: '1',
    latitude: -6.2088,
    longitude: 106.8456,
    title: 'High PM2.5 Area',
    description: 'Air quality monitoring station',
    riskLevel: 'high' as const,
  },
  {
    id: '2',
    latitude: -6.1751,
    longitude: 106.865,
    title: 'Flood Risk Zone',
    description: 'Prone to flooding during rainy season',
    riskLevel: 'moderate' as const,
  },
  {
    id: '3',
    latitude: -6.2297,
    longitude: 106.8177,
    title: 'Dengue Outbreak Area',
    description: 'Recent dengue cases reported',
    riskLevel: 'critical' as const,
  },
];

// Sample citizen reports data
const citizenReports = [
  {
    id: '1',
    citizenName: 'Ahmad Suharto',
    kelurahan: 'Menteng',
    summary: 'Heavy flooding on Jl. Sudirman causing traffic disruption. Water level reached 50cm.',
    riskLevel: 'critical' as const,
  },
  {
    id: '2',
    citizenName: 'Siti Rahayu',
    kelurahan: 'Kemayoran',
    summary: 'Air quality seems poor today with visible smog. Many people wearing masks.',
    riskLevel: 'high' as const,
  },
  {
    id: '3',
    citizenName: 'Budi Santoso',
    kelurahan: 'Kebayoran',
    summary: 'Dengue cases increasing in the neighborhood. Mosquito breeding sites found.',
    riskLevel: 'moderate' as const,
  },
  {
    id: '4',
    citizenName: 'Maya Putri',
    kelurahan: 'Tanah Abang',
    summary: 'Good air quality today, clear skies and normal traffic conditions.',
    riskLevel: 'low' as const,
  },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const { data: kelurahanData, isLoading, error } = useKelurahanByKecamatan('kebon jeruk');

  const renderCitizenReport = ({ item }: { item: (typeof citizenReports)[0] }) => (
    <CitizenReportCard report={item} />
  );

  const transformedRiskLocations =
    kelurahanData?.map((item, index) => {
      const riskAssessment = calculateRiskAssessment(item);

      return {
        id: item.id?.toString() || index.toString(),
        latitude: item.latitude,
        longitude: item.longitude,
        title: item.province,
        description: `Risk Score: ${riskAssessment.score}/100, AQI: ${item.aqi}`,
        riskLevel: riskAssessment.level,
      };
    }) || riskLocations;

  return (
    <View className="flex-1 bg-teal-600">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="min-h-screen w-full bg-slate-100">
          <View className="relative h-[420px] w-full">
            {/* Gradient background - extends to top to cover status bar */}
            <View className="absolute inset-x-0 top-0 h-[268px] bg-teal-600" />

            <View className="absolute inset-x-5 top-[118px] z-10">
              <Card className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                <CardContent className="p-0">
                  <View className="flex-col items-center gap-4">
                    {/* Map component - no extra padding needed */}
                    <TouchableOpacity
                      onPress={() => {
                        console.log('Map card pressed - navigating to map');
                        router.push('/(untab)/map');
                      }}
                      activeOpacity={0.9}
                      className="h-[132px] w-full overflow-hidden rounded-lg">
                      {isLoading ? (
                        <View className="h-full w-full items-center justify-center bg-gray-100">
                          <ActivityIndicator size="small" color="#0f766e" />
                          <Text className="mt-2 text-xs text-gray-500">Loading map data...</Text>
                        </View>
                      ) : (
                        <MapCard riskLocations={transformedRiskLocations} />
                      )}
                    </TouchableOpacity>

                    {/* Risk indicator buttons - first row */}
                    <View className="flex-row justify-center gap-3">
                      {riskIndicators.slice(0, 2).map((indicator) => (
                        <Button
                          key={indicator.id}
                          className="h-10 max-w-[146px] flex-1 flex-row items-center justify-center gap-2.5 rounded-lg border border-orange-300 bg-orange-500 p-2">
                          <FontAwesome5 name={indicator.icon} size={18} color="white" />
                          <Text variant="button" className="text-sm">
                            {indicator.title}
                          </Text>
                        </Button>
                      ))}
                    </View>

                    {/* Risk indicator buttons - second row */}
                    <View className="flex-row justify-center gap-3">
                      {riskIndicators.slice(2, 4).map((indicator) => (
                        <Button
                          key={indicator.id}
                          className="h-10 max-w-[146px] flex-1 flex-row items-center justify-center gap-2.5 rounded-lg border border-orange-300 bg-orange-500 p-2">
                          <FontAwesome5 name={indicator.icon} size={18} color="white" />
                          <Text className="text-sm font-semibold text-white">
                            {indicator.title}
                          </Text>
                        </Button>
                      ))}
                    </View>

                    {/* Report Activity button */}
                    <Button
                      variant="outline"
                      className="h-10 w-full flex-row items-center justify-center gap-2.5 rounded-lg border-2 border-teal-300 bg-white p-2">
                          <FontAwesome5 name="flag" size={18} color="#1FA09D" />
                      <Text weight="extrabold" className="text-sm font-semibold text-teal-600">
                        Report Activity
                      </Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            </View>

            {/* Risk assessment card - positioned to overlay the map directly */}
            <View className="absolute left-1/2 top-[40px] z-30 -translate-x-1/2">
              <Card className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                <CardContent className="p-0">
                  <View className="flex-col items-center gap-3">
                    <WarningIcon size={32} color="#f97316" />
                    <View className="flex-col items-center">
                      <Text
                        variant="caption"
                        className="text-center text-sm font-medium text-gray-900">
                        West Jakarta Risk Assessment
                      </Text>
                      <Text
                        variant="heading"
                        className="text-center text-3xl font-bold text-orange-500">
                        Moderate
                      </Text>
                      <Text
                        variant="caption"
                        className="max-w-[200px] text-center text-xs text-gray-700">
                        Risk elevated due to current air quality and recent rainfall.
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>
          </View>

          {/* Citizen Reports section */}
          <View className="px-5 pt-4">
            <Text variant="subheading" className="mb-4">
              Citizen Reports
            </Text>

            <View className="mb-6">
              <Carousel
                loop={true}
                width={300}
                height={180}
                snapEnabled={true}
                pagingEnabled={true}
                autoPlay={true}
                autoPlayInterval={3000}
                data={citizenReports}
                style={{ width: '100%' }}
                onSnapToItem={(index) => console.log('current citizen report:', index)}
                renderItem={renderCitizenReport}
              />
            </View>
          </View>

          {/* Actionable Plans section */}
          <View className="px-5">
            <Text variant="subheading" className="mb-4">
              Risk & Overview
            </Text>

            {/* Actionable plan cards */}
            {actionablePlans.map((plan) => (
              <View key={plan.id} className="mb-4">
                <Card className="rounded-xl border-2 border-gray-200 bg-white p-4">
                  <CardContent className="p-0">
                    <View className="flex-row gap-3">
                      <Image
                        className="h-32 w-[119px] rounded-lg border border-gray-100"
                        source={{ uri: plan.image }}
                      />

                      <View className="flex-1 gap-4">
                        <View className="flex-row justify-start">
                          <Badge className="rounded-full border border-orange-200 bg-red-200 px-2 py-1">
                            <View className="flex-row items-center gap-1">
                              <View className="h-1 w-1 rounded-full bg-orange-600" />
                              <Text weight="semibold" className="text-[9px] text-orange-600">
                                {plan.priority}
                              </Text>
                            </View>
                          </Badge>
                        </View>

                        <View className="flex-1 gap-3">
                          <View className="gap-1">
                            <Text weight="bold" className="text-lg text-gray-900">
                              {plan.title}
                            </Text>
                            <View className="flex-row items-center gap-1">
                              <Ionicons
                                name="information-circle-outline"
                                size={14}
                                color="#6b7280"
                              />
                              <Text weight="medium" className="flex-1 text-[10px] text-gray-500">
                                {plan.description}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </View>
            ))}
          </View>
          <View className="h-[20px]" />
        </View>
      </ScrollView>
    </View>
  );
}
