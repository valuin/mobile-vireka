import React, { forwardRef, useCallback, useState } from 'react';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '~/components/Badge';
import { KelurahanLocationInfo } from './KelurahanLocationInfo';
import { KelurahanIssuesList } from './KelurahanIssuesList';
import { KelurahanEnvironmentalStatus } from './KelurahanEnvironmentalStatus';
import { KelurahanActionButtons } from './KelurahanActionButtons';
import { useMapStore } from '~/stores/mapStore';

interface KelurahanRisk {
  id: string;
  latitude: number;
  longitude: number;
  kelurahan: string;
  kecamatan: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  issues: string[];
}

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
    const [activeTab, setActiveTab] = useState<'overview' | 'disease-risk'>('overview');
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
          {/* Repositioned Header */}
          <View className="mb-6">
            {/* Icon */}
            <View className="mb-4 items-center">
              <View className="rounded-full bg-teal-100 p-4">
                <Ionicons
                  name={getRiskIcon(selectedKelurahan.riskLevel)}
                  size={40}
                  color="#0f766e"
                />
              </View>
            </View>

            {/* Name and Badge Row */}
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

          {/* Tab Navigation */}
          <View className="mb-4 flex-row rounded-lg bg-gray-100 p-1">
            <TouchableOpacity
              className={`flex-1 rounded-md px-4 py-2 ${
                activeTab === 'overview' ? 'bg-white shadow-sm' : 'bg-transparent'
              }`}
              onPress={() => setActiveTab('overview')}>
              <Text
                className={`text-center font-medium ${
                  activeTab === 'overview' ? 'text-gray-900' : 'text-gray-600'
                }`}>
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-md px-4 py-2 ${
                activeTab === 'disease-risk' ? 'bg-white shadow-sm' : 'bg-transparent'
              }`}
              onPress={() => setActiveTab('disease-risk')}>
              <Text
                className={`text-center font-medium ${
                  activeTab === 'disease-risk' ? 'text-gray-900' : 'text-gray-600'
                }`}>
                Disease Risk Analysis
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'overview' ? (
            <>
              <KelurahanLocationInfo
                latitude={selectedKelurahan.latitude}
                longitude={selectedKelurahan.longitude}
              />

              <KelurahanIssuesList issues={selectedKelurahan.issues} />

              <KelurahanEnvironmentalStatus riskLevel={selectedKelurahan.riskLevel} />
            </>
          ) : (
            <View className="flex-1">
              <View className="mb-6 rounded-xl bg-orange-50 p-4">
                <Text className="mb-2 text-lg font-semibold text-orange-800">
                  Disease Risk Assessment
                </Text>
                <Text className="text-sm text-orange-700">
                  Based on current environmental conditions and historical data, this area shows{' '}
                  {selectedKelurahan.riskLevel} risk for vector-borne diseases such as dengue fever
                  and malaria.
                </Text>
              </View>

              <View className="mb-6 rounded-xl bg-blue-50 p-4">
                <Text className="mb-2 text-lg font-semibold text-blue-800">
                  Prevention Recommendations
                </Text>
                <Text className="text-sm text-blue-700">
                  Regular monitoring of water sources, elimination of standing water, and community
                  health education programs are recommended for this area.
                </Text>
              </View>
            </View>
          )}

          <KelurahanActionButtons onViewOnMap={onViewOnMap} onReportIssue={onReportIssue} />
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
