import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '~/components/Badge';

interface KelurahanDetailHeaderProps {
  kelurahan: string;
  kecamatan: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  getRiskIcon: (riskLevel: string) => any;
  getRiskBadgeProps: (riskLevel: string) => {
    className: string;
    textColor: string;
  };
}

export function KelurahanDetailHeader({
  kelurahan,
  kecamatan,
  riskLevel,
  getRiskIcon,
  getRiskBadgeProps,
}: KelurahanDetailHeaderProps) {
  const badgeProps = getRiskBadgeProps(riskLevel);

  return (
    <View className="mb-6 items-center">
      <View className="mb-4 rounded-full bg-teal-100 p-4">
        <Ionicons name={getRiskIcon(riskLevel)} size={40} color="#0f766e" />
      </View>
      <Text className="mb-2 text-center text-2xl font-bold text-gray-900">{kelurahan}</Text>
      <Text className="mb-4 text-center text-lg text-gray-600">Kecamatan {kecamatan}</Text>

      <Badge className={`flex-row gap-2 rounded-full px-4 py-2 ${badgeProps.className}`}>
        <Ionicons
          name={getRiskIcon(riskLevel)}
          size={16}
          color={badgeProps.textColor.replace('text-', '')}
        />
        <Text className={`text-sm font-bold capitalize ${badgeProps.textColor}`}>
          {riskLevel} Risk
        </Text>
      </Badge>
    </View>
  );
}
