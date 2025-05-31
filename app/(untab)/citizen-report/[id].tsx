import React from 'react';
import { View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '~/components/Badge';
import { Card, CardContent } from '~/components/Card';
import Text from '~/components/Text';

// Mock data - in real app this would come from API
const mockReports = {
  '1': {
    id: '1',
    citizenName: 'Ahmad Suharto',
    kelurahan: 'Menteng',
    kecamatan: 'Menteng',
    summary: 'Heavy flooding on Jl. Sudirman causing traffic disruption. Water level reached 50cm.',
    riskLevel: 'critical' as const,
    submittedAt: '2024-01-15 14:30',
    details:
      'Water started rising around 13:00 after heavy rain. Multiple vehicles stuck. Local authorities notified.',
    location: 'Jl. Sudirman No. 123, Menteng',
    contact: '+62 812-3456-7890',
  },
  '2': {
    id: '2',
    citizenName: 'Siti Rahayu',
    kelurahan: 'Kemayoran',
    kecamatan: 'Kemayoran',
    summary: 'Air quality seems poor today with visible smog. Many people wearing masks.',
    riskLevel: 'high' as const,
    submittedAt: '2024-01-15 12:15',
    details:
      'Visibility reduced to about 500m. Strong smell of smoke. Children and elderly advised to stay indoors.',
    location: 'Kemayoran area, near industrial zone',
    contact: '+62 813-7654-3210',
  },
};

export default function CitizenReportDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const report = mockReports[id as keyof typeof mockReports];

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text>Report not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getRiskBadgeProps = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return { className: 'bg-green-100 border-green-300', textColor: 'text-green-700' };
      case 'moderate':
        return { className: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-700' };
      case 'high':
        return { className: 'bg-orange-100 border-orange-300', textColor: 'text-orange-700' };
      case 'critical':
        return { className: 'bg-red-100 border-red-300', textColor: 'text-red-700' };
      default:
        return { className: 'bg-gray-100 border-gray-300', textColor: 'text-gray-700' };
    }
  };

  const badgeProps = getRiskBadgeProps(report.riskLevel);
  const avatarLetter = report.citizenName.charAt(0).toUpperCase();

  const handleApprove = () => {
    console.log('Approving report:', report.id);
    router.back();
  };

  const handleDiscard = () => {
    console.log('Discarding report:', report.id);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text variant="subheading">Citizen Report</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Report Card */}
        <Card className="mb-6 rounded-xl border border-gray-200 bg-white">
          <CardContent className="p-6">
            {/* Header with avatar and badge */}
            <View className="mb-4 flex-row items-start gap-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-teal-600">
                <Text weight="bold" className="text-xl text-white">
                  {avatarLetter}
                </Text>
              </View>

              <View className="flex-1">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text weight="bold" className="text-lg text-gray-900">
                    {report.citizenName}
                  </Text>
                  <Badge className={`rounded-full px-3 py-1 ${badgeProps.className}`}>
                    <Text className={`text-sm font-medium capitalize ${badgeProps.textColor}`}>
                      {report.riskLevel}
                    </Text>
                  </Badge>
                </View>
                <Text variant="caption" className="text-gray-600">
                  {report.kecamatan}, {report.kelurahan}
                </Text>
                <Text variant="caption" className="text-gray-500">
                  Submitted: {report.submittedAt}
                </Text>
              </View>
            </View>

            {/* Summary */}
            <View className="mb-4">
              <Text weight="semibold" className="mb-2 text-base text-gray-900">
                Summary
              </Text>
              <Text variant="body" className="leading-6 text-gray-700">
                {report.summary}
              </Text>
            </View>

            {/* Details */}
            <View className="mb-4">
              <Text weight="semibold" className="mb-2 text-base text-gray-900">
                Details
              </Text>
              <Text variant="body" className="leading-6 text-gray-700">
                {report.details}
              </Text>
            </View>

            {/* Location */}
            <View className="mb-4">
              <Text weight="semibold" className="mb-2 text-base text-gray-900">
                Location
              </Text>
              <Text variant="body" className="text-gray-700">
                {report.location}
              </Text>
            </View>

            {/* Contact */}
            <View>
              <Text weight="semibold" className="mb-2 text-base text-gray-900">
                Contact
              </Text>
              <Text variant="body" className="text-gray-700">
                {report.contact}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={handleDiscard}
            className="flex-1 items-center rounded-xl bg-red-500 py-4">
            <Text weight="semibold" className="text-base text-white">
              Discard Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleApprove}
            className="flex-1 items-center rounded-xl bg-green-500 py-4">
            <Text weight="semibold" className="text-base text-white">
              Approve Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
