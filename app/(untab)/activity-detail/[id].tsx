import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Text from '~/components/Text';
import { AppHeader } from '~/components/activity/AppHeader';
import { useAuth } from '~/hooks/useAuth';
import { useKelurahanByKecamatan } from '~/hooks/useKelurahanData';
import { Activity, mockActivities } from '~/components/activity/ActivityCardList';

interface CitizenReport {
  id: string;
  location: string;
  issue_type: string;
  severity: string;
  description: string;
  kecamatan: string;
}

interface PersonalizedInsight {
  summary: string;
  recommendations: string[];
  priority_actions: string[];
  local_context: string;
}

// Mock function - replace with actual API call
const fetchCitizenReports = async (userId: string): Promise<CitizenReport[]> => {
  console.log('Fetching citizen reports for user:', userId);
  // Placeholder data
  return [
    {
      id: '1',
      location: 'Kelurahan Kebon Jeruk',
      issue_type: 'Air Quality',
      severity: 'High',
      description: 'Heavy pollution from industrial area',
      kecamatan: 'Kebon Jeruk',
    },
  ];
};

// Mock function - replace with actual LLM API call
const fetchPersonalizedInsights = async (data: {
  activityId: string;
  reports: CitizenReport[];
  kelurahanData: any;
}): Promise<PersonalizedInsight> => {
  console.log('Calling LLM API with data:', data);

  // Find the actual activity by ID to get the name
  const activity = mockActivities.find((act) => act.id === data.activityId);
  const activityName = activity?.name.toLowerCase() || '';

  console.log('Activity found:', activity, 'Activity name:', activityName);

  if (activityName.includes('posyandu')) {
    return {
      summary:
        'Based on local demographic data and health reports, this Posyandu program should focus on maternal and child health monitoring with emphasis on nutrition screening and growth development.',
      recommendations: [
        'Schedule monthly weight and height measurements for children under 5',
        'Provide nutritional counseling for pregnant and lactating mothers',
        'Coordinate with local health centers for immunization schedules',
        'Establish breastfeeding education programs',
        'Monitor child development milestones regularly',
      ],
      priority_actions: [
        'Set up mobile weighing stations in the community',
        'Train local volunteers on basic health screening',
        'Distribute vitamin A supplements for children',
        'Organize prenatal check-up schedules',
      ],
      local_context:
        'Kebon Jeruk area shows higher birth rates and requires enhanced maternal-child health services. Community engagement is strong, making volunteer-based programs highly effective.',
    };
  }

  if (activityName.includes('posbindu')) {
    return {
      summary:
        'Environmental and lifestyle factors in your area indicate elevated risks for non-communicable diseases. This Posbindu program should prioritize cardiovascular health and diabetes prevention.',
      recommendations: [
        'Conduct regular blood pressure and blood sugar screenings',
        'Implement community exercise programs for adults 40+',
        'Provide education on healthy diet and lifestyle choices',
        'Establish referral systems to nearby health facilities',
        'Monitor BMI and waist circumference measurements',
      ],
      priority_actions: [
        'Set up monthly health screening schedules',
        'Train community health workers on NCD detection',
        'Create walking groups and exercise classes',
        'Distribute health education materials in local language',
      ],
      local_context:
        'Urban lifestyle in Kebon Jeruk contributes to sedentary behavior and processed food consumption. The community has good access to healthcare facilities, enabling effective follow-up care.',
    };
  }

  if (activityName.includes('imunisasi')) {
    return {
      summary:
        'Immunization coverage analysis shows gaps in routine childhood vaccines and adult boosters. This program should focus on catch-up vaccinations and maintaining high coverage rates.',
      recommendations: [
        'Conduct door-to-door immunization outreach in underserved areas',
        'Implement vaccine cold chain monitoring systems',
        'Provide education on vaccine safety and importance',
        'Coordinate with schools for adolescent vaccination programs',
        'Establish adult immunization awareness campaigns',
      ],
      priority_actions: [
        'Review and update immunization records for all children',
        'Schedule catch-up vaccination sessions',
        'Train healthcare workers on vaccine administration',
        'Set up mobile vaccination units for remote areas',
      ],
      local_context:
        'Kebon Jeruk has good healthcare infrastructure but some vaccine hesitancy exists. Community leaders support immunization programs, which helps increase acceptance rates.',
    };
  }

  // Default response for other activities
  return {
    summary:
      'Based on your reports and local environmental data, this area shows elevated air pollution levels requiring immediate attention.',
    recommendations: [
      'Conduct air quality monitoring twice daily',
      'Implement community awareness programs',
      'Coordinate with local industrial facilities',
      'Establish emergency response protocols',
    ],
    priority_actions: [
      'Set up air quality sensors in affected areas',
      'Organize community health screenings',
      'Contact environmental authorities',
    ],
    local_context:
      'Kebon Jeruk area has experienced increased industrial activity, making air quality monitoring critical for public health.',
  };
};

const ActivityDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  console.log('Activity detail screen - ID:', id, 'User:', user?.id);

  // Fetch citizen reports
  const {
    data: reports,
    isLoading: reportsLoading,
    error: reportsError,
  } = useQuery({
    queryKey: ['citizen-reports', user?.id],
    queryFn: () => fetchCitizenReports(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  // Get kecamatan from first report for kelurahan data
  const kecamatan = reports?.[0]?.kecamatan || '';

  console.log('Kecamatan for kelurahan lookup:', kecamatan);

  const { data: kelurahanData, isLoading: kelurahanLoading } = useKelurahanByKecamatan(kecamatan);

  console.log('Kelurahan data:', kelurahanData, 'Loading:', kelurahanLoading);

  // Fetch personalized insights
  const {
    data: insights,
    isLoading: insightsLoading,
    error: insightsError,
  } = useQuery({
    queryKey: ['personalized-insights', id, reports, kelurahanData],
    queryFn: () =>
      fetchPersonalizedInsights({
        activityId: id || '',
        reports: reports || [],
        kelurahanData: kelurahanData || null,
      }),
    enabled: !!id && !!reports && !reportsLoading && !kelurahanLoading,
    staleTime: 1000 * 60 * 10,
  });

  console.log('Insights query enabled:', !!id && !!reports && !reportsLoading && !kelurahanLoading);
  console.log('Insights data:', insights, 'Loading:', insightsLoading, 'Error:', insightsError);

  const isLoading = reportsLoading || kelurahanLoading || insightsLoading;

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <AppHeader />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0d9488" />
          <Text className="mt-4 text-gray-600">Generating personalized guidelines...</Text>
        </View>
      </View>
    );
  }

  if (reportsError || insightsError) {
    return (
      <View className="flex-1 bg-gray-50">
        <AppHeader />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-600">
            Failed to load personalized guidelines. Please try again.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <AppHeader />

      <ScrollView className="flex-1 px-4 py-6">
        {/* Summary Section */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text weight="bold" variant="subheading" className="mb-3 text-teal-700">
            Personalized Summary
          </Text>
          <Text variant="body" className="leading-6 text-gray-700">
            {insights?.summary}
          </Text>
        </View>

        {/* Local Context */}
        <View className="mb-6 rounded-lg bg-teal-50 p-4">
          <Text weight="bold" variant="subheading" className="mb-3 text-teal-800">
            Local Context
          </Text>
          <Text variant="body" className="leading-6 text-teal-700">
            {insights?.local_context}
          </Text>
        </View>

        {/* Priority Actions */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text weight="bold" variant="subheading" className="mb-3 text-red-700">
            Priority Actions
          </Text>
          {insights?.priority_actions.map((action, index) => (
            <View key={index} className="mb-2 flex-row items-start">
              <Text className="mr-2 text-red-600">•</Text>
              <Text variant="body" className="flex-1 text-gray-700">
                {action}
              </Text>
            </View>
          ))}
        </View>

        {/* Recommendations */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text weight="bold" variant="subheading" className="mb-3 text-teal-700">
            Recommendations
          </Text>
          {insights?.recommendations.map((recommendation, index) => (
            <View key={index} className="mb-2 flex-row items-start">
              <Text className="mr-2 text-teal-600">•</Text>
              <Text variant="body" className="flex-1 text-gray-700">
                {recommendation}
              </Text>
            </View>
          ))}
        </View>

        {/* Data Sources */}
        <View className="mb-8 rounded-lg bg-gray-100 p-4">
          <Text weight="bold" variant="caption" className="mb-2 text-gray-600">
            Based on your reports and local data:
          </Text>
          <Text variant="caption" className="text-gray-500">
            • {reports?.length || 0} citizen reports analyzed
          </Text>
          <Text variant="caption" className="text-gray-500">
            • Local kelurahan data: {kecamatan}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ActivityDetailScreen;
