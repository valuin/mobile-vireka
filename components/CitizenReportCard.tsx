import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Badge } from '~/components/Badge';
import { Card, CardContent } from '~/components/Card';
import Text from '~/components/Text';

interface CitizenReport {
  id: string;
  citizenName: string;
  kelurahan: string;
  summary: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
}

interface CitizenReportCardProps {
  report: CitizenReport;
}

const CitizenReportCard: React.FC<CitizenReportCardProps> = ({ report }) => {
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

  const handleLearnMore = () => {
    console.log('Navigating to citizen report:', report.id);
    // @ts-ignore
    router.push(`/(untab)/citizen-report/${report.id}`);
  };

  return (
    <Card className="pr-6 h-[180px] w-[300px] rounded-xl border border-gray-200 bg-white">
      <CardContent className="flex-1 p-4">
        <View className="flex-1 justify-between">
          <View className="flex-row items-start gap-3">
            {/* Avatar */}
            <View className="h-12 w-12 items-center justify-center rounded-full bg-teal-600">
              <Text weight="bold" className="text-lg text-white">
                {avatarLetter}
              </Text>
            </View>

            {/* Content */}
            <View className="flex-1">
              <View className="mb-2 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text weight="semibold" className="text-base text-gray-900">
                    {report.citizenName}
                  </Text>
                  <Text variant="caption" className="text-sm text-gray-600">
                    {report.kelurahan}
                  </Text>
                </View>
                <Badge className={`rounded-full flex-row gap-1 px-2 py-1 ${badgeProps.className}`}>
                  <Text className={`text-sm font-medium ${badgeProps.textColor}`}>•</Text>
                  <Text className={`text-sm font-medium capitalize ${badgeProps.textColor}`}>
                    {report.riskLevel}
                  </Text>
                </Badge>
              </View>

              <Text variant="body" className="text-sm leading-5 text-gray-700" numberOfLines={2}>
                {report.summary}
              </Text>
            </View>
          </View>
          {/* Learn More Button */}
          <TouchableOpacity
            onPress={handleLearnMore}
            className="mb-2 w-full rounded-lg bg-teal-600 px-3 py-2">
            <Text weight="semibold" className="text-center text-xs text-white">
              Learn More
            </Text>
          </TouchableOpacity>
        </View>
      </CardContent>
    </Card>
  );
};

export default CitizenReportCard;
