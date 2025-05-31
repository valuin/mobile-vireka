import React, { forwardRef, useCallback } from 'react';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '~/components/Badge';
import { KelurahanLocationInfo } from './KelurahanLocationInfo';
import { KelurahanIssuesList } from './KelurahanIssuesList';
import { KelurahanEnvironmentalStatus } from './KelurahanEnvironmentalStatus';
import { KelurahanActionButtons } from './KelurahanActionButtons';
import { useMapStore } from '~/stores/mapStore';
import { KelurahanRisk } from '~/types/kelurahan';

interface KelurahanDetailBottomSheetProps {
  selectedKelurahan: KelurahanRisk | null;
  snapPoints: string[];
  onDismiss: () => void;
  getRiskIcon: (riskLevel: string) => any;
  getRiskBadgeProps: (riskLevel: string) => {
    className: string;
    textColor: string;
    iconColor: string;
  };
  onViewOnMap?: () => void;
  onReportIssue?: () => void;
}

export const KelurahanDetailBottomSheet = forwardRef<
  BottomSheetModal,
  KelurahanDetailBottomSheetProps
>(
  (
    {
      selectedKelurahan,
      snapPoints,
      onDismiss,
      getRiskIcon,
      getRiskBadgeProps,
      onViewOnMap,
      onReportIssue,
    },
    ref
  ) => {
    const { closeBottomSheet } = useMapStore();

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleDismiss = useCallback(() => {
      closeBottomSheet();
      onDismiss();
    }, [closeBottomSheet, onDismiss]);

    if (!selectedKelurahan) return null;

    const badgeProps = getRiskBadgeProps(selectedKelurahan.riskLevel);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onDismiss={handleDismiss}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#ffffff' }}>
        <BottomSheetView className="flex-1 px-6 py-4">
          {/* Header */}
          <View className="mb-6">
            <View className="mb-2 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900">
                  {selectedKelurahan.kelurahan}
                </Text>
                <Text className="text-lg text-gray-600">
                  Kecamatan {selectedKelurahan.kecamatan}
                </Text>
              </View>

              <Badge className={`flex-row gap-2 rounded-full px-4 py-2 ${badgeProps.className}`}>
                <Ionicons
                  name={getRiskIcon(selectedKelurahan.riskLevel)}
                  size={16}
                  color={badgeProps.iconColor}
                />
                <Text className={`text-sm font-bold capitalize ${badgeProps.textColor}`}>
                  {selectedKelurahan.riskLevel} Risk
                </Text>
              </Badge>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="mb-6 rounded-xl bg-gray-50 p-4">
              <Text className="mb-2 text-lg font-semibold text-gray-900">Risk Assessment</Text>
              <Text className="mb-2 text-2xl font-bold text-teal-600">
                {selectedKelurahan.riskScore}/100
              </Text>
              {selectedKelurahan.riskFactors && (
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Air Quality</Text>
                    <Text className="text-sm font-medium">
                      {Math.round(selectedKelurahan.riskFactors.airQuality)}/100
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Disease Risk</Text>
                    <Text className="text-sm font-medium">
                      {Math.round(selectedKelurahan.riskFactors.diseaseRisk)}/100
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Environmental</Text>
                    <Text className="text-sm font-medium">
                      {Math.round(selectedKelurahan.riskFactors.environmentalHealth)}/100
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Socioeconomic</Text>
                    <Text className="text-sm font-medium">
                      {Math.round(selectedKelurahan.riskFactors.socioeconomic)}/100
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <KelurahanIssuesList issues={selectedKelurahan.issues} />
            <KelurahanEnvironmentalStatus riskLevel={selectedKelurahan.riskLevel} />

            {/* Disease Risk Analysis */}
            {selectedKelurahan.diseases?.overview && (
              <View className="mb-6 rounded-xl bg-orange-50 p-4">
                <Text className="mb-2 text-lg font-semibold text-orange-800">
                  Disease Risk Overview
                </Text>
                <Text className="text-sm text-orange-700">
                  {selectedKelurahan.diseases.overview}
                </Text>
              </View>
            )}

            {selectedKelurahan.diseases?.diseaseData && (
              <View className="mb-6">
                <Text className="mb-3 text-lg font-semibold text-gray-900">Disease Analysis</Text>
                {selectedKelurahan.diseases.diseaseData.map((disease: any, index: number) => (
                  <View key={index} className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-md font-semibold text-gray-900">{disease.name}</Text>
                      <View
                        className={`rounded-full px-2 py-1 ${
                          disease.riskLevel === 'tinggi'
                            ? 'bg-red-100'
                            : disease.riskLevel === 'sedang'
                              ? 'bg-yellow-100'
                              : 'bg-green-100'
                        }`}>
                        <Text
                          className={`text-xs font-medium ${
                            disease.riskLevel === 'tinggi'
                              ? 'text-red-700'
                              : disease.riskLevel === 'sedang'
                                ? 'text-yellow-700'
                                : 'text-green-700'
                          }`}>
                          {disease.riskLevel}
                        </Text>
                      </View>
                    </View>

                    <Text className="mb-2 text-sm text-gray-600">
                      Risk Percentage: {(disease.percentage * 100).toFixed(1)}%
                    </Text>

                    <Text className="mb-3 text-sm text-gray-700">
                      {disease.explanationWhyItsFeasible}
                    </Text>

                    {disease.prevention && disease.prevention.length > 0 && (
                      <View>
                        <Text className="mb-2 text-sm font-semibold text-gray-900">
                          Prevention:
                        </Text>
                        {disease.prevention.map((prevention: string, pIndex: number) => (
                          <Text key={pIndex} className="mb-1 text-sm text-gray-600">
                            • {prevention}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {!selectedKelurahan.diseases && (
              <View className="mb-6 rounded-xl bg-blue-50 p-4">
                <Text className="mb-2 text-lg font-semibold text-blue-800">
                  No Disease Data Available
                </Text>
                <Text className="text-sm text-blue-700">
                  Disease risk analysis data is not available for this kelurahan at the moment.
                </Text>
              </View>
            )}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
