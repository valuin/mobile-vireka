import React from 'react';
import { View, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Carousel from 'react-native-reanimated-carousel';
import { Badge } from '~/components/Badge';
import { Button } from '~/components/Button';
import { Card, CardContent } from '~/components/Card';
import MapCard from '~/components/MapCard';
import CitizenReportCard from '~/components/CitizenReportCard';
import Text from '~/components/Text';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// Data for actionable plans
const actionablePlans = [
  {
    id: 1,
    title: 'Improve Air Quality',
    description: 'Consider using air purifiers and ensure good ventilations',
    priority: 'Urgent',
    priorityColor: 'red-200',
    dotColor: 'orange-600',
    image: '/mask-group.png',
  },
  {
    id: 2,
    title: 'Water Safety',
    description: 'Check for drains & potential flooding sites',
    priority: 'Moderate',
    priorityColor: 'orange-200',
    dotColor: 'amber-600',
    image: '/mask-group-1.png',
  },
];

// Data for risk indicators
const riskIndicators = [
  { id: 1, title: 'High PM2.5', icon: '/frame-5.svg' },
  { id: 2, title: 'Flood Risk', icon: 'water' },
  { id: 3, title: 'Dengue Spike', icon: '/frame-3.svg' },
  { id: 4, title: 'High Humidity', icon: '/frame-4.svg' },
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
  const renderCitizenReport = ({ item }: { item: (typeof citizenReports)[0] }) => (
    <CitizenReportCard report={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="min-h-screen w-full bg-slate-100">
          {/* Header section with risk assessment */}
          <View className="relative h-[420px] w-full">
            {/* Gradient background */}
            <View className="absolute inset-x-0 top-0 h-[238px] bg-teal-600" />
            {/* Risk assessment card */}
            <View className="absolute left-1/2 top-14 -translate-x-1/2">
              <Card className="rounded-[11.5px] border border-gray-200 bg-white p-3">
                <CardContent className="p-0">
                  <View className="flex-col items-center gap-2">
                    <Image className="h-6 w-6" source={{ uri: '/frame-1.svg' }} />
                    <View className="flex-col items-center">
                      <Text variant="caption" className="text-center text-[10px] text-gray-900">
                        Jakarta Risk Assessment
                      </Text>
                      <Text variant="heading" className="text-center text-xl text-orange-500">
                        Moderate
                      </Text>
                      <Text
                        variant="caption"
                        className="max-w-[190px] text-center text-[7px] text-gray-900">
                        Risk elevated due to current air quality and recent rainfall.
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            {/* Main risk indicators card */}
            <View className="absolute inset-x-5 top-[88px]">
              <Card className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                <CardContent className="p-0">
                  <View className="flex-col items-center gap-4">
                    {/* Map component */}
                    <TouchableOpacity
                      onPress={() => {
                        console.log('Map card pressed - navigating to map');
                        router.push('/(untab)/map');
                      }}
                      activeOpacity={0.9}
                      className="h-[132px] w-full overflow-hidden rounded-lg">
                      <MapCard riskLocations={riskLocations} />
                    </TouchableOpacity>

                    {/* Risk indicator buttons - first row */}
                    <View className="flex-row justify-center gap-3">
                      {riskIndicators.slice(0, 2).map((indicator) => (
                        <Button
                          key={indicator.id}
                          className="h-10 max-w-[146px] flex-1 flex-row items-center justify-center gap-2.5 rounded-lg border border-orange-300 bg-orange-500 p-2">
                          {indicator.id === 2 ? (
                            <FontAwesome5 name="water" size={18} color="white" />
                          ) : (
                            <Image className="h-[18px] w-[18px]" source={{ uri: indicator.icon }} />
                          )}
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
                          <Image className="h-[18px] w-[18px]" source={{ uri: indicator.icon }} />
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
                      <Image className="h-[18px] w-[18px]" source={{ uri: '/frame-6.svg' }} />
                      <Text weight="extrabold" className="text-sm font-semibold text-teal-600">
                        Report Activity
                      </Text>
                    </Button>
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
              Actionable Plans
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
                            <Text weight="bold" className="text-sm text-gray-900">
                              {plan.title}
                            </Text>
                            <View className="flex-row items-center gap-1">
                              <Image className="h-3 w-3" source={{ uri: '/frame.svg' }} />
                              <Text weight="medium" className="flex-1 text-[10px] text-gray-500">
                                {plan.description}
                              </Text>
                            </View>
                          </View>

                          <Button className="h-[25px] self-start rounded border border-teal-500 bg-teal-600 px-4 py-1">
                            <Text variant="heading" className="text-[11px] text-white">
                              Learn More
                            </Text>
                          </Button>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </View>
            ))}
          </View>

          {/* Bottom spacing for tab navigation */}
          <View className="h-[20px]" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
